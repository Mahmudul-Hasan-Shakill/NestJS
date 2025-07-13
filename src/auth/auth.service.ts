import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private blacklistedTokens: string[] = [];

  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(pin: string, password: string): Promise<UserEntity> {
    const userResponse = await this.userService.getUserByPin(pin);

    if (!userResponse.isSuccessful || !userResponse.data) {
      throw new NotFoundException(`User with PIN ${pin} not found.`);
    }

    const user = userResponse.data;

    if (!user.isActive) {
      throw new UnauthorizedException('Account is Inactive.');
    }

    if (user.isLocked) {
      throw new UnauthorizedException(
        'Account is locked due to too many failed login attempts.',
      );
    }

    // if (user.isLogin) {
    //   throw new UnauthorizedException(
    //     'User is already logged in from another device.',
    //   );
    // }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= 5) {
        user.isLocked = true;
      }

      await this.userService.save(user);
      throw new UnauthorizedException('Invalid credentials provided.');
    }

    user.loginAttempts = 0;
    user.isLocked = false;
    user.isLogin = true;

    await this.userService.save(user);

    return user;
  }

  async login(user: UserEntity) {
    const payload = {
      pin: user.pin,
      sub: user.id,
    };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TIME'),
    });

    user.refreshToken = refreshToken;

    await this.userService.save(user);

    return {
      isSuccessful: true,
      message: 'Login successful',
      data: {
        expiresIn: this.configService.get<string>('ACCESS_TIME'),
        access_token: this.jwtService.sign(payload, {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        }),
        refreshToken: refreshToken,
        pin: user.pin,
        role: user.userRole,
        reset: user.isReset,
        active: user.isActive,
      },
    };
  }

  async logout(user: { user: number; pin: string }): Promise<any> {
    const fullUserResponse = await this.userService.findOne(user.user);
    if (!fullUserResponse.isSuccessful) {
      throw new UnauthorizedException('User not found.');
    }

    const fullUser = fullUserResponse.data;
    fullUser.refreshToken = null;
    fullUser.isLogin = false;
    fullUser.loginAttempts = 0;

    await this.userService.save(fullUser);

    return {
      isSuccessful: true,
      message: 'Logout successful',
    };
  }

  // async refreshToken(pin: string): Promise<any> {
  //   const userResponse = await this.userService.getUserByPin(pin);
  //   const user = userResponse.data;

  //   const payload = {
  //     pin: user.pin,
  //     sub: user.id,
  //   };

  //   const accessToken = this.jwtService.sign(payload, {
  //     secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
  //   });

  //   return {
  //     isSuccessful: true,
  //     message: 'Token refreshed successfully',
  //     data: {
  //       access_token: accessToken,
  //       expiresIn: this.configService.get<string>('ACCESS_TIME'),
  //       role: user.userRole,
  //       pin: user.pin,
  //       reset: user.isReset,
  //       active: user.isActive,
  //     },
  //   };
  // }
  async refreshToken(pin: string): Promise<any> {
    const userResponse = await this.userService.getUserByPin(pin);
    const user = userResponse.data;

    try {
      // Verify the stored refresh token
      this.jwtService.verify(user.refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch (error) {
      console.error('Refresh token verification failed:', error.message);
      throw new Error('Refresh token expired or invalid');
    }

    const payload = {
      pin: user.pin,
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_TIME'),
    });

    return {
      isSuccessful: true,
      message: 'Token refreshed successfully',
      data: {
        access_token: accessToken,
        expiresIn: this.configService.get<string>('ACCESS_TIME'),
        role: user.userRole,
        pin: user.pin,
        reset: user.isReset,
        active: user.isActive,
      },
    };
  }
}
