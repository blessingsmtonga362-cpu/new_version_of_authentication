import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
export class EmailDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(12)
  @MaxLength(128)
  password: string;
}
