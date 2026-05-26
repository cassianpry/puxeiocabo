import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: (req: Request) => {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if (token) return token;
        return req?.cookies?.accessToken || null;
      },
      secretOrKey: process.env.JWT_SECRET || 'dev-secret-change-me',
    });
  }

  async validate(payload: any) {
    const account = await this.authService.validateJwtPayload(payload);
    if (!account) {
      return null;
    }
    return { ...account, role: payload.role };
  }
}
