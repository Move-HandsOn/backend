import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentDto } from './dto/comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikeDto } from './dto/like.dto';

@Injectable()
export class InteractionsService {

  constructor(private readonly prismaService: PrismaService) { }

  async createComment(commentDto: CommentDto, user_id: string) {
    if (
      (commentDto.activity_id && commentDto.post_id) ||
      (!commentDto.activity_id && !commentDto.post_id)
    ) {
      throw new BadRequestException('Only one of activity id or post id should be provided, not both or none.');
    }

    const comment = await this.prismaService.comment.create({
      data: {
        ...commentDto,
        user_id
      }
    });

    return comment;
  }

  async deleteComment(id: string, user_id: string) {
    const comment = await this.prismaService.comment.findFirst({
      where: {
        id
      }
    })

    if (!comment) {
      throw new NotFoundException('Comment not found.')
    }

    await this.prismaService.comment.delete({
      where: {
        id,
        user_id
      }
    })
  }

  async toggleLike(likeDto: LikeDto, user_id: string){
    const { comment_id, activity_id, post_id } = likeDto;
    if (
      (comment_id && activity_id) ||
      (comment_id && post_id) ||
      (activity_id && post_id) ||
      (!comment_id && !activity_id && !post_id)
    ) {
      throw new BadRequestException('Only one of activity id, post id or comment id should be provided, not both or none.');
    }

    const searchField =
      comment_id ? { comment_id, user_id }
      : activity_id ? { activity_id, user_id }
      : { post_id, user_id };

    const like = await this.prismaService.like.findFirst({
      where: searchField,
    });

    like && await this.prismaService.like.delete({
      where: {
          id: like.id
        }
      });

    !like && await this.prismaService.like.create({
      data: {
        user_id,
        ...likeDto
      }
    });

    return
  }

  async toggleFollow(follower_id: string, followed_id: string) {
    const existingFollow = await this.prismaService.follower.findFirst({
      where: {
        followed_id,
        follower_id
      }
    })

      existingFollow && await this.prismaService.follower.delete({
        where: {
          follower_id_followed_id: {
            follower_id,
            followed_id,
          },
        },
      });

    !existingFollow && await this.prismaService.follower.create({
      data: {
        follower_id,
        followed_id,
      },
    });
  }


}
