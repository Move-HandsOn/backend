import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, ValidateIf } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // validation to ensure at least one field is present in the update
  @ValidateIf((object) => {
    return !Object.values(object).some((value) => !value);
  })
  @IsNotEmpty({ message: 'At least one field must be updated' })
  updateError?: string;
}
