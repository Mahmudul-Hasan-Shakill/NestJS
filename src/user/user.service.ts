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

// @Injectable()
// export class UserService {
//   private readonly templatePath = path.join(
//     process.cwd(),
//     'src',
//     'template',
//     'password.html',
//   );

//   constructor(
//     @InjectRepository(UserEntity)
//     private readonly userRepo: Repository<UserEntity>,
//     private configService: ConfigService,
//   ) {}

//   private generateRandomPassword(length = 10): string {
//     const chars =
//       'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
//     let password = '';
//     for (let i = 0; i < length; i++) {
//       password += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return password;
//   }

//   async create(createUserDto: CreateUserDto) {
//     const existingUser = await this.userRepo.findOne({
//       where: { pin: createUserDto.pin },
//     });
//     if (existingUser) {
//       throw new ConflictException('PIN already exists');
//     }

//     const user = this.userRepo.create(createUserDto);
//     const newPassword = this.generateRandomPassword();
//     user.password = newPassword;
//     console.log(newPassword);
//     user.isReset = true;

//     await this.userRepo.save(user);

//     await this.sendAccountEmail(
//       user.email,
//       user.pin,
//       newPassword,
//       'Account Created',
//       'Your account has been created successfully.',
//     );

//     const { password, ...result } = user;
//     return {
//       isSuccessful: true,
//       message: 'User created successfully',
//       data: result,
//     };
//   }

//   async selfRegister(createUserDto: CreateUserDto) {
//     const existingUser = await this.userRepo.findOne({
//       where: { pin: createUserDto.pin },
//     });
//     if (existingUser) {
//       throw new ConflictException('PIN already exists');
//     }

//     const user = this.userRepo.create(createUserDto);

//     user.isActive = false;
//     user.isReset = false;
//     await this.userRepo.save(user);

//     const { password, ...result } = user;
//     return {
//       isSuccessful: true,
//       message: 'Registration is Complete! Wait for admin approval.',
//       data: result,
//     };
//   }

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
//       message: 'User is updated successfully!',
//       data: updatedUser,
//     };
//   }

//   async updateUserByPin(pin: string, updateUserDto: UpdateUserDto) {
//     console.log('Received update request for pin:', pin);
//     console.log('Payload:', updateUserDto);

//     const user = await this.userRepo.findOne({ where: { pin } });

//     if (!user) {
//       console.log('User not found for pin:', pin);
//       return {
//         isSuccessful: false,
//         message: 'User not found',
//         data: null,
//       };
//     }

//     for (const key in updateUserDto) {
//       if (updateUserDto[key] !== undefined) {
//         user[key] = updateUserDto[key];
//       }
//     }

//     try {
//       const savedUser = await this.userRepo.save(user);
//       console.log('User updated successfully:', savedUser);

//       return {
//         isSuccessful: true,
//         message: 'Profile is updated successfully!',
//         data: savedUser,
//       };
//     } catch (error) {
//       console.error('Error saving user:', error);
//       return {
//         isSuccessful: false,
//         message: 'Failed to update user due to internal error.',
//         data: null,
//       };
//     }
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
//         id: 'DESC',
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

//     const newPassword = this.generateRandomPassword();
//     console.log('========================', newPassword);

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
//         newPassword,
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
//       message: 'Password has been reset successfully.',
//     };
//   }

//   private async sendAccountEmail(
//     email: string,
//     pin: string,
//     password: string,
//     subject: string,
//     introMessage: string,
//   ) {
//     const useGmail = this.configService.get<string>('USE_GMAIL') === 'true';

//     const logoBase64 = this.configService.get<string>('LOGO_BASE64');

//     const transporter = nodemailer.createTransport(
//       useGmail
//         ? {
//             host: 'smtp.gmail.com',
//             port: this.configService.get<number>('GMAIL_PORT'),
//             secure: false,
//             auth: {
//               user: this.configService.get<string>('GMAIL_USER'),
//               pass: this.configService.get<string>('GMAIL_PASS'),
//             },
//           }
//         : {
//             host: this.configService.get<string>('SMTP_IP'),
//             port: this.configService.get<number>('SMTP_PORT'),
//             secure: false,
//             tls: {
//               rejectUnauthorized: false,
//             },
//             auth: {
//               user: this.configService.get<string>('SMTP_USER'),
//               pass: this.configService.get<string>('SMTP_PASS'),
//             },
//           },
//     );

//     const htmlTemplate = fs.readFileSync(this.templatePath, 'utf8');
//     const htmlContent = htmlTemplate
//       .replace('{{PIN}}', pin)
//       .replace('{{PASSWORD}}', password)
//       .replace('{{INTRO_MESSAGE}}', introMessage);

//     const mailOptions = {
//       from: useGmail
//         ? `"Inventory Management System" <${this.configService.get<string>('GMAIL_USER')}>`
//         : '"Inventory Management System" <inventorymgttest@bracbank.com>',
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
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { Not, Repository } from 'typeorm'; // 👈 add Not
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

type AuthUserCtx = {
  id?: number;
  pin: string;
  role: string; // 'root', 'CS - Admin', ...
  unit?: string; // controller hydrates this from user profile
};

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

  /** ===== helpers for unit scoping / self-protection ===== */
  private isRoot(user?: AuthUserCtx) {
    return (user?.role ?? '').trim().toLowerCase() === 'root';
  }

  private sameUnitOrThrow(actor: AuthUserCtx | undefined, target: UserEntity) {
    if (!actor || this.isRoot(actor)) return; // root bypass
    const actorUnit = (actor.unit ?? '').trim();
    if (!actorUnit || target.unit !== actorUnit) {
      throw new ForbiddenException('You are not allowed to access this user.');
    }
  }

  private preventUnitChangeByNonRoot(
    actor: AuthUserCtx | undefined,
    target: UserEntity,
    dto: UpdateUserDto,
  ) {
    if (!actor || this.isRoot(actor)) return;
    if (
      dto.unit !== undefined &&
      dto.unit !== null &&
      dto.unit !== target.unit
    ) {
      throw new ForbiddenException('Cannot move user to another unit.');
    }
  }

  private isRootUserRow(row?: UserEntity) {
    return (row?.userRole ?? '').trim().toLowerCase() === 'root';
  }
  /** ===================================================== */

  // --- unchanged create/selfRegister/findOne/getUserByPin/save/changePassword/resetPassword ---

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
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      return { isSuccessful: false, message: 'User not found', data: null };
    }
    return { isSuccessful: true, message: 'User found', data: user };
  }

  async getUserByPin(pin: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { pin } });
    if (!user) throw new NotFoundException(`User with PIN ${pin} not found.`);
    return { isSuccessful: true, message: 'User found', data: user };
  }

  /** ===== UPDATED: unit-aware + hide root from non-root ===== */
  async getAllUsers(actor?: AuthUserCtx): Promise<any> {
    // Legacy callers (no actor) => old behavior (return all)
    if (!actor) {
      const users = await this.userRepo.find({ order: { id: 'DESC' } });
      return {
        isSuccessful: true,
        message: users.length
          ? 'Users retrieved successfully'
          : 'No users found.',
        data: users,
      };
    }

    if (this.isRoot(actor)) {
      // Root sees everyone (including root)
      const users = await this.userRepo.find({ order: { id: 'DESC' } });
      return {
        isSuccessful: true,
        message: users.length
          ? 'Users retrieved successfully'
          : 'No users found.',
        data: users,
      };
    }

    // Non-root: only same unit AND exclude root rows
    const unit = (actor.unit ?? '').trim();
    const where = unit ? { unit, userRole: Not('root') } : { id: -1 };
    const users = await this.userRepo.find({ where, order: { id: 'DESC' } });

    return {
      isSuccessful: true,
      message: users.length
        ? 'Users retrieved successfully'
        : 'No users found.',
      data: users,
    };
  }
  /** ======================================================= */

  /** ===== UPDATED: protect root from non-root; block self via admin ===== */
  async update(id: number, updateUserDto: UpdateUserDto, actor?: AuthUserCtx) {
    const target = await this.userRepo.findOne({ where: { id } });
    if (!target) {
      return {
        isSuccessful: false,
        message: 'User not found or no changes made',
        data: null,
      };
    }

    // Disallow admin-updating self (use profile endpoint)
    if (actor?.id && target.id === actor.id) {
      throw new ForbiddenException(
        'You cannot update your own account from this page. Use Profile.',
      );
    }

    if (this.isRoot(actor)) {
      // Root can update anyone (including other roots)
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

    // Non-root cannot touch root users
    if (this.isRootUserRow(target)) {
      throw new ForbiddenException('Cannot modify a root user.');
    }

    // Non-root: unit scope + cannot change unit
    this.sameUnitOrThrow(actor, target);
    this.preventUnitChangeByNonRoot(actor, target, updateUserDto);

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
  /** ==================================================================== */

  async updateUserByPin(pin: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { pin } });
    if (!user) {
      return { isSuccessful: false, message: 'User not found', data: null };
    }

    for (const key in updateUserDto) {
      if (updateUserDto[key] !== undefined) {
        (user as any)[key] = updateUserDto[key];
      }
    }

    try {
      const savedUser = await this.userRepo.save(user);
      return {
        isSuccessful: true,
        message: 'Profile is updated successfully!',
        data: savedUser,
      };
    } catch (error) {
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

  /** ===== UPDATED: protect root from non-root; block self via admin ===== */
  async deleteUser(id: number, actor?: AuthUserCtx): Promise<any> {
    const target = await this.userRepo.findOne({ where: { id } });
    if (!target) throw new NotFoundException(`User with ID ${id} not found.`);

    // Disallow self-delete via admin list
    if (actor?.id && target.id === actor.id) {
      throw new ForbiddenException(
        'You cannot delete your own account from this page.',
      );
    }

    if (!this.isRoot(actor)) {
      // Non-root: cannot delete root & must be same unit
      if (this.isRootUserRow(target)) {
        throw new ForbiddenException('Cannot delete a root user.');
      }
      this.sameUnitOrThrow(actor, target);
    }

    const result = await this.userRepo.delete(id);

    if (result.affected > 0) {
      return { isSuccessful: true, message: 'User deleted successfully.' };
    } else {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
  }
  /** ==================================================================== */

  // --- unchanged password reset / email helpers below ---

  private generateRandomPassword(length = 10): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  async changePassword(
    pin: string,
    changePasswordDto: UpdateUserDto,
  ): Promise<any> {
    const user = await this.userRepo.findOne({ where: { pin } });
    if (!user) throw new NotFoundException('User not found.');
    if (!changePasswordDto.password) {
      throw new BadRequestException('New password is required.');
    }
    const hashedPassword = await bcrypt.hash(changePasswordDto.password, 10);
    user.password = hashedPassword;
    user.isReset = false;
    await this.userRepo.save(user);
    return { isSuccessful: true, message: 'Password changed successfully.' };
  }

  async resetPassword(pin: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { pin } });
    if (!user) throw new NotFoundException('User not found.');

    const newPassword = this.generateRandomPassword();
    try {
      user.password = await bcrypt.hash(newPassword, 10);
    } catch {
      throw new HttpException(
        'Error hashing password.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    user.isReset = true;

    try {
      await this.userRepo.save(user);
    } catch {
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
    } catch {
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
            tls: { rejectUnauthorized: false },
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
        if (error) return reject(new Error('Failed to send email.'));
        setTimeout(() => resolve(true), 10000);
      });
    });
  }
}
