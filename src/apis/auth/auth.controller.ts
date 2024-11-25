import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LoginResponse } from '../../shared/utils/types';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';
import { UserEntity } from '../../entities/user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto): Promise<UserEntity> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() credentials: LoginUserDto): Promise<LoginResponse> {
    const loginResults = await this.authService.login(credentials);

    if (!loginResults) {
      throw new UnauthorizedException(
        'This email, password combination was not found',
      );
    }

    return loginResults;
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  async logout(): Promise<any> {
    await this.authService.logout();
    return { message: 'ok' };
  }
}
