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

    // Check if the user was found
    if (!userResponse.isSuccessful || !userResponse.data) {
      throw new NotFoundException(`User with PIN ${pin} not found.`);
    }

    const user = userResponse.data;

    // Check if the user account is active
    if (!user.isActive) {
      throw new UnauthorizedException(
        'Account is Inactive. Contact Pranto for Assistance.',
      );
    }

    // Validate the password
    if (await bcrypt.compare(password, user.password)) {
      return user;
    }

    throw new UnauthorizedException('Invalid credentials provided.'); // Invalid password
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

    // const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
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
    await this.userService.save(fullUser);

    const token = fullUser.refreshToken;
    if (token) {
      this.blacklistedTokens.push(token);
    }

    return {
      isSuccessful: true,
      message: 'Logout successful',
      data: {},
    };
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.includes(token);
  }

  // async refreshToken(user: UserEntity) {
  //   const payload = {
  //     pin: user.pin,
  //     sub: user.id,
  //   };

  //   return {
  //     isSuccessful: true,
  //     message: 'Token refreshed successfully',
  //     data: {
  //       access_token: this.jwtService.sign(payload, {
  //         secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
  //       }),
  //     },
  //   };
  // }

  async refreshToken(pin: string): Promise<any> {
    // Fetch user by PIN
    const userResponse = await this.userService.getUserByPin(pin);
    const user = userResponse.data;

    // Create payload for access token
    const payload = {
      pin: user.pin,
      sub: user.id,
    };

    // Generate new access token
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });

    return {
      isSuccessful: true,
      message: 'Token refreshed successfully',
      data: {
        access_token: accessToken,
      },
    };
  }
}
