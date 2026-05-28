import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '../common/authenticated-request';
import {
  RegisterDto,
  LoginDto,
  LinkShortIdDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangeEmailDto,
  VerifyEmailChangeDto,
  AuthResponseDto,
} from './dto';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 15 * 60 * 1000,
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('accessToken', accessToken, ACCESS_COOKIE_OPTIONS);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
  }

  private clearCookies(res: Response) {
    res.clearCookie('accessToken', { ...ACCESS_COOKIE_OPTIONS, maxAge: undefined });
    res.clearCookie('refreshToken', { ...COOKIE_OPTIONS, maxAge: undefined });
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new account' })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or email already exists' })
  async register(@Body() body: RegisterDto) {
    if (!body.email || !body.password) {
      throw new BadRequestException('Email e senha são obrigatórios');
    }
    if (body.password.length < 6) {
      throw new BadRequestException('Senha deve ter pelo menos 6 caracteres');
    }
    if (!body.consent) {
      throw new BadRequestException('Você precisa aceitar a Política de Privacidade');
    }
    try {
      const result = await this.authService.register(body.email, body.password, body.consent);
      return { accountId: result.accountId, email: result.email, message: 'Verifique seu e-mail para ativar sua conta' };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    if (!body.email || !body.password) {
      throw new BadRequestException('Email e senha são obrigatórios');
    }
    try {
      const result = await this.authService.login(body.email, body.password);
      this.setCookies(res, result.accessToken, result.refreshToken);
      return { accountId: result.accountId, shortId: result.shortId, role: result.role };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email with token' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async verifyEmail(@Body() body: VerifyEmailChangeDto) {
    try {
      await this.authService.verifyEmail(body.token);
      return { message: 'E-mail verificado com sucesso' };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset email' })
  @ApiResponse({ status: 201, description: 'If the email exists, a reset link was sent' })
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    if (!body.email) {
      throw new BadRequestException('Email é obrigatório');
    }
    await this.authService.forgotPassword(body.email);
    return { message: 'Se o email existir, você receberá um link de redefinição' };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() body: ResetPasswordDto) {
    try {
      await this.authService.resetPassword(body.token, body.newPassword);
      return { message: 'Senha redefinida com sucesso' };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('change-email')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Request email change' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Verification email sent' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changeEmail(@Req() req: AuthenticatedRequest, @Body() body: ChangeEmailDto) {
    try {
      await this.authService.changeEmail(req.user.id, body.newEmail, body.currentPassword);
      return { message: 'Verifique seu novo email para confirmar a alteração' };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('verify-email-change')
  @ApiOperation({ summary: 'Confirm email change with token' })
  @ApiResponse({ status: 200, description: 'Email changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async verifyEmailChange(@Body() body: VerifyEmailChangeDto) {
    try {
      await this.authService.verifyEmailChange(body.token);
      return { message: 'Email alterado com sucesso' };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Req() req: AuthenticatedRequest, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken || req.headers.authorization?.replace('Bearer ', '');
    const result = await this.authService.refreshToken(refreshToken);
    this.setCookies(res, result.accessToken, result.refreshToken);
    return { success: true };
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Req() req: AuthenticatedRequest, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user.id);
    this.clearCookies(res);
    return { message: 'Logged out successfully' };
  }

  @Post('link')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Link account to SF6 short_id' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'short_id linked successfully' })
  @ApiResponse({ status: 400, description: 'Invalid short_id or already linked' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async link(@Req() req: AuthenticatedRequest, @Body() body: LinkShortIdDto) {
    if (!body.shortId) {
      throw new BadRequestException('shortId é obrigatório');
    }
    try {
      return await this.authService.linkShortId(req.user.id, body.shortId);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async me(@Req() req: AuthenticatedRequest) {
    return this.authService.getProfile(req.user.id);
  }

  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Change account password' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid current password or validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(@Req() req: AuthenticatedRequest, @Body() body: ChangePasswordDto, @Res({ passthrough: true }) res: Response) {
    try {
      const result = await this.authService.changePassword(
        req.user.id,
        body.currentPassword,
        body.newPassword,
        body.confirmNewPassword,
      );
      this.setCookies(res, result.accessToken, result.refreshToken);
      return { message: 'Senha alterada com sucesso' };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Post('delete-account')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete account and anonymize reports' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteAccount(@Req() req: AuthenticatedRequest, @Res({ passthrough: true }) res: Response) {
    try {
      await this.authService.deleteAccount(req.user.id);
      this.clearCookies(res);
      return { message: 'Conta excluída com sucesso' };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  @Get('export')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Export personal data' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Personal data exported' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async exportData(@Req() req: AuthenticatedRequest) {
    return this.authService.exportData(req.user.id);
  }
}
