import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtPayload } from '../common/authenticated-request';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: (req: Request) => {
        const headerToken = req.headers.authorization?.replace('Bearer ', '');
        if (headerToken) return headerToken;
        return req?.cookies?.refreshToken || null;
      },
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.cookies?.refreshToken || req.headers.authorization?.replace('Bearer ', '');
    if (!refreshToken) {
      return null;
    }
    const account = await this.authService.validateRefreshTokenForStrategy(refreshToken);
    if (!account) {
      return null;
    }
    return account;
  }
}
