import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name can`t be empty' })
  name: string;

  @IsString({ message: 'Email must be a string.' })
  @IsNotEmpty({ message: 'Email can`t be empty' })
  @IsEmail({}, { message: 'Must be a valid email' })
  email: string;

  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password can`t be empty' })
  @MinLength(6, { message: 'Must have at least 6 characteres' })
  @MaxLength(32, { message: 'Must have less then 32 characteres' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,32}$/gm, {
    message: `At least one digit [0-9]
    At least one lowercase character [a-z]
    At least one uppercase character [A-Z]
    At least one special character [*.!@#$%^&(){}[]:;<>,.?/~_+-=|\]
    At least 8 characters in length, but no more than 32.`,
  })
  password: string;

  profile_image?: string;

  @IsOptional()
  @IsString({ message: 'Bio must be a string.' })
  @MaxLength(300, { message: 'Must have less then 300 characteres' })
  bio?: string;

  gender?: string;
  refreshToken?: string;
}
