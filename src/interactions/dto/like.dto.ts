import { IsOptional, IsString} from "class-validator"

export class LikeDto {
  @IsOptional()
  @IsString({ message: 'Comment id must be a string.' })
  comment_id?: string

  @IsOptional()
  @IsString({ message: 'Activity id must be a string.' })
  activity_id?: string

  @IsOptional()
  @IsString({ message: 'Post id must be a string.' })
  post_id?: string
}
