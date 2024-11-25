import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from '../../token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false;
    }

    const token = authHeader.split(' ')[1]; // Extract token from Bearer header
    if (!token) {
      return false;
    }

    try {
      const user = this.tokenService.decodeAndValidateJWT(token);
      request.user = user;
      return true;
    } catch (err) {
      return false;
    }
  }
}
