import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  Res,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { CookiesService } from 'src/common/cookies/cookies.service';

// RBAC Imports
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequireGuiPermissions } from 'src/common/decorators/require-gui-permissions.decorator';
import { PermissionActions } from '../common/enums/permissions.enum';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cookiesService: CookiesService,
  ) {}

  @Post('self-register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.selfRegister(createUserDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Get()
  async getAllUsers() {
    try {
      return await this.userService.getAllUsers();
    } catch (error) {
      console.error('Unexpected error in getAllUsers:', error);
      throw new HttpException('An unexpected error occurred.', 500);
    }
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const result = await this.userService.update(id, updateUserDto);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Unexpected error in updateUser:', error);
      throw new HttpException('An unexpected error occurred.', 500);
    }
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Patch('pin/:pin')
  async updateUserByPin(
    @Param('pin') pin: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const result = await this.userService.updateUserByPin(pin, updateUserDto);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Unexpected error in updateUser:', error);
      throw new HttpException('An unexpected error occurred.', 500);
    }
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Get('pin/:pin')
  async getUserByPin(@Param('pin') pin: string) {
    try {
      return await this.userService.getUserByPin(pin);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Unexpected error in getUserByPin:', error);
      throw new HttpException('An unexpected error occurred.', 500);
    }
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Delete(':id')
  @RequireGuiPermissions([PermissionActions.DELETE])
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.userService.deleteUser(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Unexpected error in deleteUser:', error);
      throw new HttpException('An unexpected error occurred.', 500);
    }
  }

  @Patch('reset-password/:pin')
  async resetPassword(@Param('pin') pin: string) {
    try {
      const result = await this.userService.resetPassword(pin);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Unexpected error in resetPassword:', error);
      throw new HttpException(
        'An unexpected error occurred while resetting the password.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard, PermissionsGuard)
  @Patch('change-password/:pin')
  @RequireGuiPermissions([PermissionActions.UPDATE])
  async changePassword(
    @Param('pin') pin: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.userService.changePassword(pin, updateUserDto);

      if (result?.isSuccessful) {
        // res.clearCookie('RST', {
        //   path: '/',
        // });
        res.clearCookie('RST', this.cookiesService.clearMisc());
      }

      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Unexpected error in changePassword:', error);
      throw new HttpException('An unexpected error occurred.', 500);
    }
  }
}
