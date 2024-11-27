import { IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateIf } from "class-validator"

export enum PostType {
  PROFILE = 'profile',
  GROUP = 'group'
}

export class CreatePostDto {
  @IsNotEmpty({ message: 'Content can`t be empty' })
  @IsString({ message: 'Content must be a string.' })
  @MaxLength(500, { message: 'Must have less then 500 characteres' })
  post_content: string

  @IsEnum(PostType, { message: 'Type must be either "profile" or "group".' })
  post_type: string

  @ValidateIf((o) => o.post_type === PostType.GROUP)
  @IsString({ message: 'Group ID must be a string.' })
  @IsNotEmpty({ message: 'Group ID is required when type is "group".' })
  group_id?: string;
}
