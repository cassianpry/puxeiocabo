import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailJsService } from '../emailjs/emailjs.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailJs: EmailJsService,
  ) {
    this.jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-me';
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me';
  }

  async register(email: string, password: string, consent: boolean) {
    if (!consent) {
      throw new Error('Você precisa aceitar a Política de Privacidade');
    }

    const existing = await this.prisma.account.findUnique({ where: { email } });
    if (existing) {
      throw new Error('Email já cadastrado');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const account = await this.prisma.account.create({
      data: { email, passwordHash, consentGivenAt: new Date() },
    });

    const token = crypto.randomUUID();
    await this.prisma.verificationToken.create({
      data: {
        token,
        type: 'email_verification',
        accountId: account.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    try {
      await this.emailJs.sendEmailVerification(email, token);
    } catch {
    }

    return {
      accountId: account.id,
      email: account.email,
    };
  }

  async login(email: string, password: string) {
    const account = await this.prisma.account.findUnique({ where: { email } });

    if (!account) {
      throw new Error('Credenciais inválidas');
    }

    const passwordMatch = await bcrypt.compare(password, account.passwordHash);
    if (!passwordMatch) {
      throw new Error('Credenciais inválidas');
    }

    if (!account.emailVerifiedAt) {
      throw new Error('E-mail não verificado. Verifique sua caixa de entrada.');
    }

    const tokens = await this.generateTokens(account.id, account.role);
    await this.updateRefreshToken(account.id, tokens.refreshToken);

    return {
      accountId: account.id,
      shortId: account.shortId?.toString() || null,
      role: account.role,
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: this.jwtRefreshSecret });
      const account = await this.prisma.account.findUnique({ where: { id: payload.sub } });

      if (!account || !account.refreshToken) {
        throw new Error('Token de atualização inválido');
      }

      const match = await bcrypt.compare(refreshToken, account.refreshToken);
      if (!match) {
        throw new Error('Token de atualização inválido');
      }

      const tokens = await this.generateTokens(account.id, account.role);
      await this.updateRefreshToken(account.id, tokens.refreshToken);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch {
      throw new Error('Token de atualização inválido');
    }
  }

  async linkShortId(accountId: number, shortId: string) {
    const shortIdBigInt = BigInt(shortId);
    const fighter = await this.prisma.fighter.findUnique({ where: { shortId: shortIdBigInt } });
    if (!fighter) {
      throw new Error('Lutador não encontrado');
    }

    const existingLink = await this.prisma.account.findFirst({ where: { shortId: shortIdBigInt } });
    if (existingLink && existingLink.id !== accountId) {
      throw new Error('Este shortId já está vinculado a outra conta');
    }

    const account = await this.prisma.account.update({
      where: { id: accountId },
      data: { shortId: shortIdBigInt },
    });

    return { shortId: account.shortId?.toString() };
  }

  async getProfile(accountId: number) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: { fighter: true },
    });
    if (!account) {
      throw new Error('Conta não encontrada');
    }

    return {
      id: account.id,
      email: account.email,
      shortId: account.shortId?.toString() || null,
      fighter: account.fighter,
      role: account.role,
      createdAt: account.createdAt,
    };
  }

  async changePassword(
    accountId: number,
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ) {
    const account = await this.prisma.account.findUnique({ where: { id: accountId } });
    if (!account) {
      throw new Error('Conta não encontrada');
    }

    const passwordMatch = await bcrypt.compare(currentPassword, account.passwordHash);
    if (!passwordMatch) {
      throw new Error('Senha atual incorreta');
    }

    if (newPassword !== confirmNewPassword) {
      throw new Error('As senhas não conferem');
    }

    if (newPassword.length < 6) {
      throw new Error('A senha deve ter no mínimo 6 caracteres');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    const tokens = await this.generateTokens(account.id, account.role);
    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);

    await this.prisma.account.update({
      where: { id: accountId },
      data: {
        passwordHash,
        refreshToken: hashedRefresh,
      },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async forgotPassword(email: string) {
    const account = await this.prisma.account.findUnique({ where: { email } });
    if (!account) {
      return;
    }

    const token = crypto.randomUUID();
    await this.prisma.verificationToken.create({
      data: {
        token,
        type: 'password_reset',
        accountId: account.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    try {
      await this.emailJs.sendPasswordReset(email, token);
    } catch {
    }
  }

  async resetPassword(token: string, newPassword: string) {
    if (newPassword.length < 6) {
      throw new Error('A senha deve ter no mínimo 6 caracteres');
    }

    const vt = await this.prisma.verificationToken.findUnique({ where: { token } });
    if (!vt || vt.type !== 'password_reset' || vt.usedAt || vt.expiresAt < new Date()) {
      throw new Error('Token inválido ou expirado');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: vt.accountId },
        data: { passwordHash, refreshToken: null },
      }),
      this.prisma.verificationToken.update({
        where: { id: vt.id },
        data: { usedAt: new Date() },
      }),
    ]);

  }

  async verifyEmail(token: string) {
    const vt = await this.prisma.verificationToken.findUnique({ where: { token } });
    if (!vt || vt.type !== 'email_verification' || vt.usedAt || vt.expiresAt < new Date()) {
      throw new Error('Token inválido ou expirado');
    }

    await this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: vt.accountId },
        data: { emailVerifiedAt: new Date() },
      }),
      this.prisma.verificationToken.update({
        where: { id: vt.id },
        data: { usedAt: new Date() },
      }),
    ]);
  }

  async changeEmail(accountId: number, newEmail: string, currentPassword: string) {
    const account = await this.prisma.account.findUnique({ where: { id: accountId } });
    if (!account) {
      throw new Error('Conta não encontrada');
    }

    const passwordMatch = await bcrypt.compare(currentPassword, account.passwordHash);
    if (!passwordMatch) {
      throw new Error('Senha atual incorreta');
    }

    if (newEmail === account.email) {
      throw new Error('O novo email é igual ao atual');
    }

    const existing = await this.prisma.account.findUnique({ where: { email: newEmail } });
    if (existing) {
      throw new Error('Este email já está em uso');
    }

    const token = crypto.randomUUID();
    await this.prisma.verificationToken.create({
      data: {
        token,
        type: 'email_change',
        accountId,
        metadata: JSON.stringify({ newEmail }),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    try {
      await this.emailJs.sendEmailChangeVerification(newEmail, token);
    } catch {
    }
  }

  async verifyEmailChange(token: string) {
    const vt = await this.prisma.verificationToken.findUnique({ where: { token } });
    if (!vt || vt.type !== 'email_change' || vt.usedAt || vt.expiresAt < new Date()) {
      throw new Error('Token inválido ou expirado');
    }

    const metadata = JSON.parse(vt.metadata || '{}');
    const newEmail = metadata.newEmail;
    if (!newEmail) {
      throw new Error('Token inválido');
    }

    const existing = await this.prisma.account.findUnique({ where: { email: newEmail } });
    if (existing && existing.id !== vt.accountId) {
      throw new Error('Este email já está em uso');
    }

    await this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: vt.accountId },
        data: { email: newEmail },
      }),
      this.prisma.verificationToken.update({
        where: { id: vt.id },
        data: { usedAt: new Date() },
      }),
    ]);
  }

  async deleteAccount(accountId: number) {
    const account = await this.prisma.account.findUnique({ where: { id: accountId } });
    if (!account) {
      throw new Error('Conta não encontrada');
    }

    if (account.shortId) {
      await this.prisma.report.updateMany({
        where: { reporterId: account.shortId },
        data: {
          exifData: null,
          aiSuspicious: false,
          aiReason: null,
        },
      });
    }

    await this.prisma.account.update({
      where: { id: accountId },
      data: {
        email: `deleted-${accountId}@removed`,
        passwordHash: 'DELETED',
        refreshToken: null,
        shortId: null,
      },
    });
  }

  async exportData(accountId: number) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: { fighter: true },
    });
    if (!account) {
      throw new Error('Conta não encontrada');
    }

    const reports = account.shortId
      ? await this.prisma.report.findMany({
          where: { reporterId: account.shortId, status: { not: 'deleted' } },
          include: { reported: true },
        })
      : [];

    return {
      email: account.email,
      role: account.role,
      createdAt: account.createdAt,
      fighter: account.fighter
        ? {
            shortId: account.fighter.shortId.toString(),
            fighterId: account.fighter.fighterId,
            platformName: account.fighter.platformName,
            circleName: account.fighter.circleName,
          }
        : null,
      reports: reports.map((r) => ({
        id: r.id,
        reportedFighterId: r.reported.fighterId,
        reportedPlatformName: r.reported.platformName,
        comment: r.comment,
        status: r.status,
        createdAt: r.createdAt,
      })),
    };
  }

  async logout(accountId: number) {
    await this.prisma.account.update({
      where: { id: accountId },
      data: { refreshToken: null },
    });
  }

  async validateJwtPayload(payload: any) {
    const account = await this.prisma.account.findUnique({
      where: { id: payload.sub },
      include: { fighter: true },
    });
    if (!account) {
      return null;
    }
    return account;
  }

  private async generateTokens(accountId: number, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: accountId, role }, { secret: this.jwtSecret, expiresIn: '15m' }),
      this.jwtService.signAsync({ sub: accountId }, { secret: this.jwtRefreshSecret, expiresIn: '7d' }),
    ]);
    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(accountId: number, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.prisma.account.update({
      where: { id: accountId },
      data: { refreshToken: hashed },
    });
  }

  async validateRefreshTokenForStrategy(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: this.jwtRefreshSecret });
      const account = await this.prisma.account.findUnique({ where: { id: payload.sub } });
      if (!account || !account.refreshToken) {
        return null;
      }
      const match = await bcrypt.compare(refreshToken, account.refreshToken);
      return match ? account : null;
    } catch {
      return null;
    }
  }
}
