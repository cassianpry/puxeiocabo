import { Request } from 'express';

export interface JwtPayload {
  sub: number;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: number;
  email: string;
  shortId: bigint | null;
  role: string;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  fighter: {
    shortId: bigint;
    fighterId: string;
    platformId: number;
    platformName: string;
    platformTool: string;
    circleName: string | null;
  } | null;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
