import { Injectable } from '@nestjs/common';
import { sign, SignOptions, verify } from 'jsonwebtoken';
import { v4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, LoginResponse } from '../../shared/utils/types';

@Injectable()
export class TokenService {
  private readonly jwtOptions: SignOptions;
  private readonly jwtKey: string;
  private expiresInDefault: number;

  constructor(private readonly configService: ConfigService) {
    this.expiresInDefault = configService.get('JWT_EXPIRATION_TIME');
    this.jwtKey = configService.get('JWT_SECRET');
    this.jwtOptions = { expiresIn: this.expiresInDefault };
  }

  async createAccessToken(
    payload: JwtPayload,
    expires = this.expiresInDefault,
  ): Promise<LoginResponse> {
    // If expires is negative it means that token should not expire
    const options = this.jwtOptions;
    expires > 0 ? (options.expiresIn = expires) : delete options.expiresIn;

    options.jwtid = v4();
    const signedPayload = sign(payload, this.jwtKey, options);

    return {
      accessToken: signedPayload,
      expiresIn: expires,
    };
  }

  async decodeAndValidateJWT(token: string): Promise<any> {
    try {
      const payload = await this.validateToken(token);
      return {
        id: payload.sub,
      };
    } catch (error) {
      return null;
    }
  }

  private async validateToken(
    token: string,
    ignoreExpiration: boolean = false,
  ): Promise<JwtPayload> {
    return verify(token, this.configService.get('Key'), {
      ignoreExpiration,
    }) as JwtPayload;
  }
}
