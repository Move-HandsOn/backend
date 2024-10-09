import { MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
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
  passwordConfirmation: string;
}
