import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdatePostDto {
  @IsNotEmpty({ message: 'Content can`t be empty' })
  @IsString({ message: 'Content must be a string.' })
  @MaxLength(500, { message: 'Must have less than 500 characters' })
  post_content: string;
}
