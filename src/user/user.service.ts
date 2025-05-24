import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (!user) {
      return {
        isSuccessful: false,
        message: 'User not found',
        data: null,
      };
    }
    return {
      isSuccessful: true,
      message: 'User found',
      data: user,
    };
  }

  async getUserByPin(pin: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { pin } });
    if (!user) {
      throw new NotFoundException(`User with PIN ${pin} not found.`);
    }
    return {
      isSuccessful: true,
      message: 'User found',
      data: user,
    };
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    await this.userRepo.save(user);
    const { password, ...result } = user;
    return {
      isSuccessful: true,
      message: 'User created successfully',
      data: result,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const result = await this.userRepo.update(id, updateUserDto);
    if (result.affected === 0) {
      return {
        isSuccessful: false,
        message: 'User not found or no changes made',
        data: null,
      };
    }

    const updatedUser = await this.userRepo.findOne({ where: { id } });

    return {
      isSuccessful: true,
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  async save(user: UserEntity): Promise<any> {
    const savedUser = await this.userRepo.save(user);
    return {
      isSuccessful: true,
      message: 'User saved successfully',
      data: savedUser,
    };
  }

  async getAllUsers(): Promise<any> {
    const users = await this.userRepo.find({
      order: {
        id: 'ASC',
      },
    });
    return {
      isSuccessful: true,
      message:
        users.length > 0 ? 'Users retrieved successfully' : 'No users found.',
      data: users,
    };
  }

  async deleteUser(id: number): Promise<any> {
    const result = await this.userRepo.delete(id);

    if (result.affected > 0) {
      return {
        isSuccessful: true,
        message: 'User deleted successfully.',
      };
    } else {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
  }

  async changePassword(
    pin: string,
    changePasswordDto: UpdateUserDto,
  ): Promise<any> {
    const user = await this.userRepo.findOne({ where: { pin } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (!changePasswordDto.password) {
      throw new BadRequestException('New password is required.');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.password, 10);

    user.password = hashedPassword;
    user.isReset = false;

    await this.userRepo.save(user);

    return {
      isSuccessful: true,
      message: 'Password changed successfully.',
    };
  }

  async resetPassword(pin: string): Promise<any> {
    // Find the user by pin
    const user = await this.userRepo.findOne({ where: { pin } });

    // Check if the user exists
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // Generate a new default password
    const newPassword = 'Bbl@12345';

    // Hash the new password using bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user properties
    user.password = hashedPassword; // Set the new hashed password
    user.isReset = true; // Mark as password reset required

    // Save the updated user entity
    await this.userRepo.save(user);

    return {
      isSuccessful: true,
      message: 'Password has been reset successfully. Default password is set.',
    };
  }
}
