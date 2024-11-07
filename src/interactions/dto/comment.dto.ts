import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator"

export class CommentDto {
  @IsNotEmpty({ message: 'Comment text can`t be empty' })
  @IsString({ message: 'Comment text must be a string.' })
  @MaxLength(500, { message: 'Must have less then 500 characteres' })
  comment_text: string

  @IsOptional()
  @IsString({ message: 'Activity id must be a string.' })
  activity_id?: string

  @IsOptional()
  @IsString({ message: 'Post id must be a string.' })
  post_id?: string
}
