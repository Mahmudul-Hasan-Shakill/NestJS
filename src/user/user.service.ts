// import {
//   BadRequestException,
//   ConflictException,
//   HttpException,
//   HttpStatus,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { UserEntity } from '../user/entity/user.entity';
// import { Repository } from 'typeorm';
// import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
// import * as bcrypt from 'bcrypt';
// import * as nodemailer from 'nodemailer';
// import * as fs from 'fs';
// import * as path from 'path';
// import { ConfigService } from '@nestjs/config';

// const templatePath = path.join(
//   process.cwd(),
//   'src',
//   'template',
//   'password.html',
// );
// let htmlContent = fs.readFileSync(templatePath, 'utf8');

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(UserEntity)
//     private readonly userRepo: Repository<UserEntity>,
//     private configService: ConfigService,
//   ) {}

//   async findOne(id: number) {
//     const user = await this.userRepo.findOne({ where: { id: id } });
//     if (!user) {
//       return {
//         isSuccessful: false,
//         message: 'User not found',
//         data: null,
//       };
//     }
//     return {
//       isSuccessful: true,
//       message: 'User found',
//       data: user,
//     };
//   }

//   async getUserByPin(pin: string): Promise<any> {
//     const user = await this.userRepo.findOne({ where: { pin } });
//     if (!user) {
//       throw new NotFoundException(`User with PIN ${pin} not found.`);
//     }
//     return {
//       isSuccessful: true,
//       message: 'User found',
//       data: user,
//     };
//   }

//   async create(createUserDto: CreateUserDto) {
//     const existingUser = await this.userRepo.findOne({
//       where: { pin: createUserDto.pin },
//     });
//     if (existingUser) {
//       throw new ConflictException('PIN already exists');
//     }

//     // Create and save the new user
//     const user = this.userRepo.create(createUserDto);
//     await this.userRepo.save(user);

//     // Send account creation email
//     await this.sendAccountEmail(
//       user.email,
//       user.pin,
//       'Account Created',
//       'Your account has been created successfully.',
//     );

//     // Exclude the password from the response
//     const { password, ...result } = user;
//     return {
//       isSuccessful: true,
//       message: 'User created successfully',
//       data: result,
//     };
//   }

//   async update(id: number, updateUserDto: UpdateUserDto) {
//     const result = await this.userRepo.update(id, updateUserDto);
//     if (result.affected === 0) {
//       return {
//         isSuccessful: false,
//         message: 'User not found or no changes made',
//         data: null,
//       };
//     }

//     const updatedUser = await this.userRepo.findOne({ where: { id } });

//     return {
//       isSuccessful: true,
//       message: 'User updated successfully',
//       data: updatedUser,
//     };
//   }

//   async save(user: UserEntity): Promise<any> {
//     const savedUser = await this.userRepo.save(user);
//     return {
//       isSuccessful: true,
//       message: 'User saved successfully',
//       data: savedUser,
//     };
//   }

//   async getAllUsers(): Promise<any> {
//     const users = await this.userRepo.find({
//       order: {
//         id: 'ASC',
//       },
//     });
//     return {
//       isSuccessful: true,
//       message:
//         users.length > 0 ? 'Users retrieved successfully' : 'No users found.',
//       data: users,
//     };
//   }

//   async deleteUser(id: number): Promise<any> {
//     const result = await this.userRepo.delete(id);

//     if (result.affected > 0) {
//       return {
//         isSuccessful: true,
//         message: 'User deleted successfully.',
//       };
//     } else {
//       throw new NotFoundException(`User with ID ${id} not found.`);
//     }
//   }

//   async changePassword(
//     pin: string,
//     changePasswordDto: UpdateUserDto,
//   ): Promise<any> {
//     const user = await this.userRepo.findOne({ where: { pin } });

//     if (!user) {
//       throw new NotFoundException('User not found.');
//     }

//     if (!changePasswordDto.password) {
//       throw new BadRequestException('New password is required.');
//     }

//     const hashedPassword = await bcrypt.hash(changePasswordDto.password, 10);

//     user.password = hashedPassword;
//     user.isReset = false;

//     await this.userRepo.save(user);

//     return {
//       isSuccessful: true,
//       message: 'Password changed successfully.',
//     };
//   }

//   async resetPassword(pin: string): Promise<any> {
//     const user = await this.userRepo.findOne({ where: { pin } });
//     if (!user) {
//       throw new NotFoundException('User not found.');
//     }
//     const newPassword = 'Bbl@12345';
//     try {
//       user.password = await bcrypt.hash(newPassword, 10);
//     } catch (hashError) {
//       console.error('Error hashing password:', hashError);
//       throw new HttpException(
//         'Error hashing password.',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }

//     user.isReset = true;

//     try {
//       await this.userRepo.save(user);
//       console.log('User saved successfully');
//     } catch (saveError) {
//       throw new HttpException(
//         'Error saving user.',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }

//     try {
//       await this.sendAccountEmail(
//         user.email,
//         user.pin,
//         'Password Reset',
//         'Your password has been reset.',
//       );
//     } catch (emailError) {
//       console.error('Error sending email:', emailError);
//       throw new HttpException(
//         'Error sending email.',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }

//     return {
//       isSuccessful: true,
//       message: 'Password has been reset successfully. Default password is set.',
//     };
//   }

//   private async sendAccountEmail(
//     email: string,
//     pin: string,
//     subject: string,
//     introMessage: string,
//   ) {
//     const transporter = nodemailer.createTransport({
//       host: this.configService.get<string>('SMTP_IP'),
//       port: this.configService.get<number>('SMTP_PORT'),
//       secure: false,
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });

//     htmlContent = htmlContent
//       .replace('{{PIN}}', pin)
//       .replace('{{PASSWORD}}', 'Bbl@12345')
//       .replace('{{INTRO_MESSAGE}}', introMessage);

//     const mailOptions = {
//       from: '"Inventory Management System" <noreply@bracbank.com>',
//       to: email,
//       subject,
//       html: htmlContent,
//     };

//     return new Promise((resolve, reject) => {
//       transporter.sendMail(mailOptions, (error) => {
//         if (error) {
//           return reject(new Error('Failed to send email.'));
//         }
//         setTimeout(() => {
//           resolve(true);
//         }, 10000);
//       });
//     });
//   }
// }
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
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

@Injectable()
export class UserService {
  private readonly templatePath = path.join(
    process.cwd(),
    'src',
    'template',
    'password.html',
  );

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private configService: ConfigService,
  ) {}

  private generateRandomPassword(length = 10): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepo.findOne({
      where: { pin: createUserDto.pin },
    });
    if (existingUser) {
      throw new ConflictException('PIN already exists');
    }

    const user = this.userRepo.create(createUserDto);
    const newPassword = this.generateRandomPassword();
    user.password = newPassword;
    console.log(newPassword);
    user.isReset = true;

    await this.userRepo.save(user);

    await this.sendAccountEmail(
      user.email,
      user.pin,
      newPassword,
      'Account Created',
      'Your account has been created successfully.',
    );

    const { password, ...result } = user;
    return {
      isSuccessful: true,
      message: 'User created successfully',
      data: result,
    };
  }

  async selfRegister(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepo.findOne({
      where: { pin: createUserDto.pin },
    });
    if (existingUser) {
      throw new ConflictException('PIN already exists');
    }

    const user = this.userRepo.create(createUserDto);

    user.isActive = false;
    user.isReset = false;
    await this.userRepo.save(user);

    const { password, ...result } = user;
    return {
      isSuccessful: true,
      message: 'Registration is Complete! Wait for admin approval.',
      data: result,
    };
  }

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
      message: 'User is updated successfully!',
      data: updatedUser,
    };
  }

  async updateUserByPin(pin: string, updateUserDto: UpdateUserDto) {
    console.log('Received update request for pin:', pin);
    console.log('Payload:', updateUserDto);

    const user = await this.userRepo.findOne({ where: { pin } });

    if (!user) {
      console.log('User not found for pin:', pin);
      return {
        isSuccessful: false,
        message: 'User not found',
        data: null,
      };
    }

    for (const key in updateUserDto) {
      if (updateUserDto[key] !== undefined) {
        user[key] = updateUserDto[key];
      }
    }

    try {
      const savedUser = await this.userRepo.save(user);
      console.log('User updated successfully:', savedUser);

      return {
        isSuccessful: true,
        message: 'Profile is updated successfully!',
        data: savedUser,
      };
    } catch (error) {
      console.error('Error saving user:', error);
      return {
        isSuccessful: false,
        message: 'Failed to update user due to internal error.',
        data: null,
      };
    }
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
        id: 'DESC',
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
    const user = await this.userRepo.findOne({ where: { pin } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const newPassword = this.generateRandomPassword();
    console.log('========================', newPassword);

    try {
      user.password = await bcrypt.hash(newPassword, 10);
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
    } catch (saveError) {
      throw new HttpException(
        'Error saving user.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      await this.sendAccountEmail(
        user.email,
        user.pin,
        newPassword,
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
      message: 'Password has been reset successfully.',
    };
  }

  private async sendAccountEmail(
    email: string,
    pin: string,
    password: string,
    subject: string,
    introMessage: string,
  ) {
    const useGmail = this.configService.get<string>('USE_GMAIL') === 'true';

    const logoBase64 = this.configService.get<string>('LOGO_BASE64');

    const transporter = nodemailer.createTransport(
      useGmail
        ? {
            host: 'smtp.gmail.com',
            port: this.configService.get<number>('GMAIL_PORT'),
            secure: false,
            auth: {
              user: this.configService.get<string>('GMAIL_USER'),
              pass: this.configService.get<string>('GMAIL_PASS'),
            },
          }
        : {
            host: this.configService.get<string>('SMTP_IP'),
            port: this.configService.get<number>('SMTP_PORT'),
            secure: false,
            tls: {
              rejectUnauthorized: false,
            },
            auth: {
              user: this.configService.get<string>('SMTP_USER'),
              pass: this.configService.get<string>('SMTP_PASS'),
            },
          },
    );

    const htmlTemplate = fs.readFileSync(this.templatePath, 'utf8');
    const htmlContent = htmlTemplate
      .replace('{{PIN}}', pin)
      .replace('{{PASSWORD}}', password)
      .replace('{{INTRO_MESSAGE}}', introMessage);

    const mailOptions = {
      from: useGmail
        ? `"Inventory Management System" <${this.configService.get<string>('GMAIL_USER')}>`
        : '"Inventory Management System" <inventorymgttest@bracbank.com>',
      to: email,
      subject,
      html: htmlContent,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          return reject(new Error('Failed to send email.'));
        }
        setTimeout(() => {
          resolve(true);
        }, 10000);
      });
    });
  }
}
