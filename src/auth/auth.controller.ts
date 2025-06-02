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

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  // @Post('login')
  // async login(@Body() loginDto: LoginDto) {
  //   const user = await this.authService.validateUser(
  //     loginDto.pin,
  //     loginDto.password,
  //   );
  //   return this.authService.login(user);
  // }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(
      loginDto.pin,
      loginDto.password,
    );

    const loginResult = await this.authService.login(user);

    const accessToken = loginResult.data.access_token;

    const accessTime = this.configService.get<string>('ACCESS_TIME');
    const accessTimeMs = parseInt(accessTime) * 1000;

    res.cookie('ACSTKN', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: accessTimeMs,
    });

    const restData = loginResult.data;

    return res.send({
      isSuccessful: true,
      message: loginResult.message,
      data: restData,
    });
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  // @ApiSecurity('csrf-token')
  // @UseGuards(RefreshJwtGuard)
  // @Post('refresh')
  // async refreshToken(@Request() req: any) {
  //   return this.authService.refreshToken(req.user);
  // }

  @UseGuards(RefreshJwtGuard)
  @Get('refresh/:pin')
  async refreshToken(@Param('pin') pin: string) {
    return this.authService.refreshToken(pin);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    const user = req.user;

    return await this.authService.logout(user);
  }
}
