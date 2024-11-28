import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email can`t be empty' })
  @IsEmail({}, { message: 'Must be a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Password can`t be empty' })
  @MinLength(6, { message: 'Must have at least 6 characteres' })
  @MaxLength(32, { message: 'Must have less then 32 characteres' })
  password: string;
}
