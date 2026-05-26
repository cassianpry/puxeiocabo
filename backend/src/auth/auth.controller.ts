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
import { RegisterDto, LoginDto, LinkShortIdDto, AuthResponseDto } from './dto';

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
  async register(@Body() body: RegisterDto, @Res({ passthrough: true }) res: Response) {
    if (!body.email || !body.password) {
      throw new BadRequestException('Email e senha são obrigatórios');
    }
    if (body.password.length < 6) {
      throw new BadRequestException('Senha deve ter pelo menos 6 caracteres');
    }
    try {
      const result = await this.authService.register(body.email, body.password);
      this.setCookies(res, result.accessToken, result.refreshToken);
      return { accountId: result.accountId, shortId: result.shortId };
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

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Req() req: any, @Res({ passthrough: true }) res: Response) {
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
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
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
  async link(@Req() req: any, @Body() body: LinkShortIdDto) {
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
  async me(@Req() req: any) {
    return this.authService.getProfile(req.user.id);
  }
}
