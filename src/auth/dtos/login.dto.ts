import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pin: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
