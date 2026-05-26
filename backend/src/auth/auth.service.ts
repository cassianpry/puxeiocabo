import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    this.jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-me';
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me';
  }

  async register(email: string, password: string) {
    const existing = await this.prisma.account.findUnique({ where: { email } });
    if (existing) {
      throw new Error('Email já cadastrado');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const account = await this.prisma.account.create({
      data: { email, passwordHash },
    });

    const tokens = await this.generateTokens(account.id, account.role);
    await this.updateRefreshToken(account.id, tokens.refreshToken);

    return {
      accountId: account.id,
      shortId: account.shortId?.toString() || null,
      ...tokens,
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
