import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveFieldDto {
  @IsString()
  @IsNotEmpty()
  tableName: string;

  @IsString()
  @IsNotEmpty()
  fieldName: string;
}
