import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;
  @IsEmail({}, { message: 'This is not a valid email.' })
  email: string;
  password: string;
  profile_image?: string;
  bio?: string;
  gender?: string;
  interests?: string;
}
