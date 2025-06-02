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

    // Check if a JWT token is present
    const token = request.headers['authorization']?.split(' ')[1];
    if (token) {
      try {
        const payload = this.jwtService.verify(token, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        });

        // Check if the user ID in the payload matches the user associated with the PIN
        const userResponse = await this.userService.getUserByPin(pin);
        if (userResponse) {
          const user = userResponse.data;
          // Allow access if the user ID from the payload matches the user ID from the PIN
          return payload.sub === user.id;
        }
        return false; // User not found for the provided PIN
      } catch (error) {
        // Token is invalid, do not allow access
        return false;
      }
    }

    // If no token, check if the PIN is valid
    if (pin) {
      const userResponse = await this.userService.getUserByPin(pin);
      return !!userResponse; // Return true if user exists
    }

    return false; // No valid token or PIN
  }
}
