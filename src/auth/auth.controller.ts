import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/user.dto';
import { UserService } from '../../src/user/user.service';
import { AuthService } from './auth.service';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';
import { JwtGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dtos/login.dto';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @ApiSecurity('csrf-token')
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.pin,
      loginDto.password,
    );
    return this.authService.login(user);
  }

  @ApiBearerAuth('access-token')
  @ApiSecurity('csrf-token')
  @UseGuards(JwtGuard)
  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req: any) {
    return this.authService.refreshToken(req.user);
  }

  @ApiBearerAuth('access-token')
  @ApiSecurity('csrf-token')
  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    const user = req.user;

    return await this.authService.logout(user);
  }
}
