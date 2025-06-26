// import { Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class RefreshJwtGuard extends AuthGuard('jwt-refresh') {}

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

@Injectable()
export class RefreshJwtGuard
  extends AuthGuard('jwt-refresh')
  implements CanActivate
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const pin = request.params.pin;

    const token = request.headers['authorization']?.split(' ')[1];
    if (token) {
      try {
        const payload = this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        });

        const userResponse = await this.userService.getUserByPin(pin);
        if (userResponse) {
          const user = userResponse.data;
          return payload.sub === user.id;
        }
        return false;
      } catch (error) {
        return false;
      }
    }

    if (pin) {
      const userResponse = await this.userService.getUserByPin(pin);
      return !!userResponse; 
    }

    return false;
  }
}
