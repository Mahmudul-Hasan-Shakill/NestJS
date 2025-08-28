// import {
//   Body,
//   Controller,
//   Get,
//   Param,
//   Post,
//   Request,
//   Res,
//   UseGuards,
// } from '@nestjs/common';
// import { CreateUserDto } from '../user/dto/user.dto';
// import { UserService } from '../../src/user/user.service';
// import { AuthService } from './auth.service';
// import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';
// import { JwtGuard } from './guards/jwt-auth.guard';
// import { LoginDto } from './dtos/login.dto';
// import { ApiBearerAuth } from '@nestjs/swagger';
// import { Response } from 'express';
// import { ConfigService } from '@nestjs/config';
// import { EncryptionService } from './strategies/encryption.service';

// @Controller('auth')
// export class AuthController {
//   constructor(
//     private authService: AuthService,
//     private userService: UserService,
//     private configService: ConfigService,
//     private encryptionService: EncryptionService,
//   ) {}

//   @Post('login')
//   async login(@Body() loginDto: LoginDto, @Res() res: Response) {
//     const user = await this.authService.validateUser(
//       loginDto.pin,
//       loginDto.password,
//     );

//     const loginResult = await this.authService.login(user);

//     const accessToken = loginResult.data.access_token;
//     const userRole = this.encryptionService.encrypt(loginResult.data.role);
//     const userPin = this.encryptionService.encrypt(loginResult.data.pin);
//     const isReset = loginResult.data.reset;

//     const accessTime = this.configService.get<string>('ACCESS_TIME');
//     const accessTimeMs = parseInt(accessTime.replace('s', ''), 10) * 1000;
//     const expiryDate = new Date(Date.now() + accessTimeMs);

//     res.cookie('ACSTKN', accessToken, {
//       httpOnly: false,
//       secure: false,
//       sameSite: 'lax',
//       expires: expiryDate,
//     });

//     res.cookie('RST', isReset, {
//       httpOnly: false,
//       secure: false,
//       sameSite: 'lax',
//       expires: expiryDate,
//     });

//     res.cookie('USRROLE', userRole, {
//       httpOnly: false,
//       secure: false,
//       sameSite: 'lax',
//       expires: expiryDate,
//     });

//     res.cookie('USRPIN', userPin, {
//       httpOnly: false,
//       secure: false,
//       sameSite: 'lax',
//       expires: expiryDate,
//     });

//     return res.send({
//       isSuccessful: true,
//       message: loginResult.message,
//       data: loginResult.data,
//     });
//   }

//   @ApiBearerAuth('access-token')
//   @UseGuards(JwtGuard)
//   @Post('register')
//   async registerUser(@Body() createUserDto: CreateUserDto) {
//     return await this.userService.create(createUserDto);
//   }

//   @UseGuards(RefreshJwtGuard)
//   @Get('refresh/:pin')
//   async refreshToken(@Param('pin') pin: string, @Res() res: Response) {
//     try {
//       const refreshResult = await this.authService.refreshToken(pin);

//       const accessToken = refreshResult.data.access_token;
//       const accessTime = refreshResult.data.expiresIn;
//       const accessTimeMs = parseInt(accessTime.replace('s', ''), 10) * 1000;
//       const expiryDate = new Date(Date.now() + accessTimeMs);

//       res.cookie('ACSTKN', accessToken, {
//         httpOnly: false,
//         secure: false,
//         sameSite: 'lax',
//         expires: expiryDate,
//       });

//       const isReset = refreshResult.data.reset;
//       res.cookie('RST', isReset, {
//         httpOnly: false,
//         secure: false,
//         sameSite: 'lax',
//         expires: expiryDate,
//       });

//       const userRole = this.encryptionService.encrypt(refreshResult.data.role);
//       res.cookie('USRROLE', userRole, {
//         httpOnly: false,
//         secure: false,
//         sameSite: 'lax',
//         expires: expiryDate,
//       });

//       const userPin = this.encryptionService.encrypt(refreshResult.data.pin);
//       res.cookie('USRPIN', userPin, {
//         httpOnly: false,
//         secure: false,
//         sameSite: 'lax',
//         expires: expiryDate,
//       });

//       return res.send(refreshResult);
//     } catch (error) {
//       return res.status(401).send({
//         isSuccessful: false,
//         message: error.message || 'Unauthorized',
//       });
//     }
//   }

//   @ApiBearerAuth('access-token')
//   @UseGuards(JwtGuard)
//   @Post('logout')
//   async logout(@Request() req: any, @Res() res: Response) {
//     const user = req.user;

//     const result = await this.authService.logout(user);

//     // Clear cookies
//     res.clearCookie('ACSTKN', {
//       httpOnly: true,
//       secure: false,
//       sameSite: 'lax',
//     });
//     res.clearCookie('RST', {
//       httpOnly: true,
//       secure: false,
//       sameSite: 'lax',
//     });
//     res.clearCookie('USRROLE', {
//       httpOnly: false,
//       secure: false,
//       sameSite: 'lax',
//     });
//     res.clearCookie('USRPIN', {
//       httpOnly: false,
//       secure: false,
//       sameSite: 'lax',
//     });

//     return res.send({
//       isSuccessful: true,
//       message: result.message,
//       data: {},
//     });
//   }
// }

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/user.dto';
import { UserService } from '../../src/user/user.service';
import { AuthService } from './auth.service';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';
import { JwtGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dtos/login.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { EncryptionService } from './strategies/encryption.service';
import { CookiesService } from 'src/common/cookies/cookies.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly encryptionService: EncryptionService,
    private readonly cookies: CookiesService,
  ) {}

  private parseAccessMs(from: string): number {
    // supports "3600s" or milliseconds
    if (!from) return 3600 * 1000;
    const s = String(from).trim();
    if (s.endsWith('s')) {
      const n = parseInt(s.slice(0, -1), 10);
      return Number.isFinite(n) ? n * 1000 : 3600 * 1000;
    }
    const n = parseInt(s, 10);
    return Number.isFinite(n) ? n : 3600 * 1000;
  }

  private setAuthCookies(
    res: Response,
    {
      accessToken,
      role,
      pin,
      reset,
      maxAgeMs,
    }: {
      accessToken: string;
      role: string;
      pin: string;
      reset: boolean;
      maxAgeMs: number;
    },
  ) {
    // Access token cookie
    res.cookie('ACSTKN', accessToken, this.cookies.accessOptions(maxAgeMs));

    // Misc app cookies (role, pin, reset) – often non-httpOnly because UI uses them
    res.cookie('RST', reset, this.cookies.miscOptions(maxAgeMs));
    res.cookie(
      'USRROLE',
      this.encryptionService.encrypt(role),
      this.cookies.miscOptions(maxAgeMs),
    );
    res.cookie(
      'USRPIN',
      this.encryptionService.encrypt(pin),
      this.cookies.miscOptions(maxAgeMs),
    );
  }

  private clearAuthCookies(res: Response) {
    res.clearCookie('ACSTKN', this.cookies.clearAccess());
    res.clearCookie('RST', this.cookies.clearMisc());
    res.clearCookie('USRROLE', this.cookies.clearMisc());
    res.clearCookie('USRPIN', this.cookies.clearMisc());
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(
      loginDto.pin,
      loginDto.password,
    );
    const loginResult = await this.authService.login(user);

    const accessToken = loginResult.data.access_token;
    const role = loginResult.data.role;
    const pin = loginResult.data.pin;
    const reset = loginResult.data.reset;

    const accessTime = this.configService.get<string>('ACCESS_TIME') || '3600s';
    const maxAgeMs = this.parseAccessMs(accessTime);

    this.setAuthCookies(res, {
      accessToken,
      role,
      pin,
      reset,
      maxAgeMs,
    });

    return res.send({
      isSuccessful: true,
      message: loginResult.message,
      data: loginResult.data,
    });
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(RefreshJwtGuard)
  @Get('refresh/:pin')
  async refreshToken(@Param('pin') pin: string, @Res() res: Response) {
    try {
      const refreshResult = await this.authService.refreshToken(pin);

      const accessToken = refreshResult.data.access_token;
      // prefer server-reported TTL if present, else fallback to ACCESS_TIME
      const reported = refreshResult.data.expiresIn as string | undefined;
      const accessTime =
        reported || this.configService.get<string>('ACCESS_TIME') || '3600s';
      const maxAgeMs = this.parseAccessMs(accessTime);

      const role = refreshResult.data.role;
      const reset = refreshResult.data.reset;
      const encPin = refreshResult.data.pin;

      this.setAuthCookies(res, {
        accessToken,
        role,
        pin: encPin,
        reset,
        maxAgeMs,
      });

      return res.send(refreshResult);
    } catch (error: any) {
      return res.status(401).send({
        isSuccessful: false,
        message: error.message || 'Unauthorized',
      });
    }
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@Request() req: any, @Res() res: Response) {
    const result = await this.authService.logout(req.user);
    this.clearAuthCookies(res);
    return res.send({
      isSuccessful: true,
      message: result.message,
      data: {},
    });
  }
}
