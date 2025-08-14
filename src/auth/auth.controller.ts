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

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private configService: ConfigService,
    private encryptionService: EncryptionService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(
      loginDto.pin,
      loginDto.password,
    );

    const loginResult = await this.authService.login(user);

    const accessToken = loginResult.data.access_token;
    const userRole = this.encryptionService.encrypt(loginResult.data.role);
    const userPin = this.encryptionService.encrypt(loginResult.data.pin);
    const isReset = loginResult.data.reset;

    const accessTime = this.configService.get<string>('ACCESS_TIME');
    const accessTimeMs = parseInt(accessTime.replace('s', ''), 10) * 1000;
    const expiryDate = new Date(Date.now() + accessTimeMs);

    res.cookie('ACSTKN', accessToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      expires: expiryDate,
    });

    res.cookie('RST', isReset, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      expires: expiryDate,
    });

    res.cookie('USRROLE', userRole, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      expires: expiryDate,
    });

    res.cookie('USRPIN', userPin, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      expires: expiryDate,
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
    return await this.userService.create(createUserDto);
  }

  @UseGuards(RefreshJwtGuard)
  @Get('refresh/:pin')
  async refreshToken(@Param('pin') pin: string, @Res() res: Response) {
    try {
      const refreshResult = await this.authService.refreshToken(pin);

      const accessToken = refreshResult.data.access_token;
      const accessTime = refreshResult.data.expiresIn;
      const accessTimeMs = parseInt(accessTime.replace('s', ''), 10) * 1000;
      const expiryDate = new Date(Date.now() + accessTimeMs);

      res.cookie('ACSTKN', accessToken, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        expires: expiryDate,
      });

      const isReset = refreshResult.data.reset;
      res.cookie('RST', isReset, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        expires: expiryDate,
      });

      const userRole = this.encryptionService.encrypt(refreshResult.data.role);
      res.cookie('USRROLE', userRole, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        expires: expiryDate,
      });

      const userPin = this.encryptionService.encrypt(refreshResult.data.pin);
      res.cookie('USRPIN', userPin, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        expires: expiryDate,
      });

      return res.send(refreshResult);
    } catch (error) {
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
    const user = req.user;

    const result = await this.authService.logout(user);

    // Clear cookies
    res.clearCookie('ACSTKN', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    res.clearCookie('RST', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    res.clearCookie('USRROLE', {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
    });
    res.clearCookie('USRPIN', {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
    });

    return res.send({
      isSuccessful: true,
      message: result.message,
      data: {},
    });
  }
}
