import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

const templatePath = path.join(
  process.cwd(),
  'src',
  'template',
  'password.html',
);
let htmlContent = fs.readFileSync(templatePath, 'utf8');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private configService: ConfigService,
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

  // async create(createUserDto: CreateUserDto) {
  //   const user = this.userRepo.create(createUserDto);
  //   await this.userRepo.save(user);
  //   const { password, ...result } = user;
  //   return {
  //     isSuccessful: true,
  //     message: 'User created successfully',
  //     data: result,
  //   };
  // }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepo.create(createUserDto);
      await this.userRepo.save(user);

      await this.sendAccountEmail(
        user.email,
        user.pin,
        'Account Created',
        'Your account has been created successfully.',
      );

      const { password, ...result } = user;
      return {
        isSuccessful: true,
        message: 'User created successfully',
        data: result,
      };
    } catch (error) {
      // Log the error for debugging
      console.error('Error creating user:', error);

      // Handle specific error cases
      if (error.code === '23505') {
        // Unique violation error code for PostgreSQL
        throw new ConflictException('Email or PIN already exists');
      }

      throw new InternalServerErrorException(
        'An error occurred while creating the user',
      );
    }
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

  // async resetPassword(pin: string): Promise<any> {
  //   const user = await this.userRepo.findOne({ where: { pin } });
  //   if (!user) {
  //     throw new NotFoundException('User not found.');
  //   }
  //   const newPassword = 'Bbl@12345';
  //   const hashedPassword = await bcrypt.hash(newPassword, 10);
  //   user.password = hashedPassword; // Set the new hashed password
  //   user.isReset = true; // Mark as password reset required
  //   await this.userRepo.save(user);
  //   return {
  //     isSuccessful: true,
  //     message: 'Password has been reset successfully. Default password is set.',
  //   };
  // }

  async resetPassword(pin: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { pin } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const newPassword = 'Bbl@12345';
    try {
      user.password = await bcrypt.hash(newPassword, 10);
      console.log('Password hashed successfully');
    } catch (hashError) {
      console.error('Error hashing password:', hashError);
      throw new HttpException(
        'Error hashing password.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    user.isReset = true;

    try {
      await this.userRepo.save(user);
      console.log('User saved successfully');
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      throw new HttpException(
        'Error saving user.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      await this.sendAccountEmail(
        user.email,
        user.pin,
        'Password Reset',
        'Your password has been reset.',
      );
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      throw new HttpException(
        'Error sending email.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      isSuccessful: true,
      message: 'Password has been reset successfully. Default password is set.',
    };
  }

  private async sendAccountEmail(
    email: string,
    pin: string,
    subject: string,
    introMessage: string,
  ) {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_IP'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      // auth: {
      //   user: '',
      //   pass: '',
      // },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // const htmlContent = `
    //   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    //     <div style="text-align: center; background-color: #007bff; padding: 15px; border-radius: 10px 10px 0 0;">
    //       <h1 style="color: #ffffff; margin: 0; font-size: 24px;">User Notification</h1>
    //     </div>
    //     <div style="padding: 20px; background-color: #ffffff; border-radius: 0 0 10px 10px;">
    //       <p style="font-size: 14px; color: #333;">${introMessage}</p>
    //       <p style="font-size: 14px; color: #333;">Your default password is:</p>
    //       <p style="text-align: center; font-size: 22px; font-weight: bold; color: #ff4500; background-color: #ffe5e5; padding: 10px; border-radius: 5px;">Bbl@12345</p>
    //       <p style="font-size: 14px; color: #333;">Your PIN is:</p>
    //       <p style="text-align: center; font-size: 20px; font-weight: bold; color: #007bff;">${pin}</p>
    //       <p style="font-size: 14px; color: #333;">Please change your password after logging in.</p>
    //       <p style="font-size: 14px; color: #333;">Thanks,<br>Core Systems</p>
    //     </div>
    //   </div>
    // `;
    htmlContent = htmlContent
      .replace('{{PIN}}', pin)
      .replace('{{PASSWORD}}', 'Bbl@12345')
      .replace('{{INTRO_MESSAGE}}', introMessage);

    const mailOptions = {
      from: '"Inventory Management System" <noreply@bracbank.com>',
      to: email,
      subject,
      html: htmlContent,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error('Email send error:', error);
          return reject(new Error('Failed to send email.'));
        }
        console.log('Email sent successfully to:', email);
        resolve(true);
      });
    });
  }
}
