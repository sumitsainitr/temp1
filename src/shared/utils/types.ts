import { UserEntity } from '../../entities/user';

export interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
  jti?: string;
}

export type LoginResponse = {
  accessToken: string;
  expiresIn: number;
};

export type AuthenticatedRequest = { user: UserEntity };
