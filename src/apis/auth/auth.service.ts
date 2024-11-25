import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { JwtPayload, LoginResponse } from '../../shared/utils/types';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async login(dto: LoginUserDto): Promise<LoginResponse> {
    const user = await this.userService.login(dto);

    const payload: JwtPayload = {
      sub: user.id,
    };

    return this.tokenService.createAccessToken(payload);
  }

  async register(dto: CreateUserDto) {
    return this.userService.register(dto);
  }

  // cannot revoke jwt token manully
  async logout(): Promise<any> {}
}
