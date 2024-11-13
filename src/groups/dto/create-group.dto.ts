import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator"

export enum GroupType {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export class CreateGroupDto {
  @IsNotEmpty({ message: 'Group name can`t be empty' })
  @IsString({ message: 'Group name must be a string.' })
  @MaxLength(100, { message: 'Must have less than 500 characters' })
  name: string

  @IsNotEmpty({ message: 'Categroy can`t be empty' })
  @IsString({ message: 'Categroy must be a string.' })
  category_name: string

  @IsString({ message: 'Description must be a string.' })
  @MaxLength(500, { message: 'Must have less than 500 characters' })
  description: string

  @IsEnum(GroupType, { message: 'Type must be either "private" or "public".' })
  group_type: string

  @IsOptional()
  friend_ids?: string[]
}
