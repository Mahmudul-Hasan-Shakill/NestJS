import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @SkipThrottle()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
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

  @UseGuards(JwtGuard)
  @Delete(':id')
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

  @UseGuards(JwtGuard)
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
      throw new HttpException('An unexpected error occurred.', 500);
    }
  }

  @UseGuards(JwtGuard)
  @Patch('change-password/:pin')
  async changePassword(
    @Param('pin') pin: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const result = await this.userService.changePassword(pin, updateUserDto);
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
