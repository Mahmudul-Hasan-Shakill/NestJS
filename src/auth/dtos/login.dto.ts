import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  pin: string; // User PIN for login

  @IsString()
  @IsNotEmpty()
  password: string; // Password for login
}
