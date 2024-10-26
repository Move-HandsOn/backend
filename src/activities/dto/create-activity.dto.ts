import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, ValidateIf } from 'class-validator';

export enum ActivityType {
  PRIVATE = 'private',
  PROFILE = 'profile',
  GROUP = 'group'
}

export class CreateActivityDto {
  @IsEnum(ActivityType, { message: 'Type must be either "private", "profile", or "group".' })
  @IsNotEmpty({ message: 'Type can`t be empty' })
  post_type: ActivityType;

  @IsNumber({ allowNaN: false },{ message: 'Duration must be a number in seconds.' })
  @IsNotEmpty({ message: 'Duration can`t be empty' })
  @Type(() => Number)
  duration: number;

  @IsString({ message: 'Category name must be a string.' })
  @IsNotEmpty({ message: 'Category name can`t be empty' })
  category_name: string;

  @IsDate({ message: 'Must be a valid datetime.' })
  @IsNotEmpty({ message: 'Date can`t be empty' })
  @Type(() => Date)
  activity_date: Date;

  @IsString({ message: 'Description name must be a string.' })
  @MaxLength(350, { message: 'Must have less then 32 characteres' })
  description?: string;

  @ValidateIf((o) => o.type === ActivityType.GROUP)
  @IsString({ message: 'Group ID must be a string.' })
  @IsNotEmpty({ message: 'Group ID is required when type is "group".' })
  group_id?: string;
}
