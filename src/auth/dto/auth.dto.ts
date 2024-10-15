import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { LoginDto } from './login-user.dto';

export class AuthDto implements Partial<LoginDto> {
  @IsNotEmpty({ message: 'Subject can`t be empty' })
  @IsString({ message: 'Must be a String' })
  sub: string;

  @IsNotEmpty({ message: 'Email can`t be empty' })
  @IsEmail({}, { message: 'Must be a valid email' })
  email: string;
}
