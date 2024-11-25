import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CommentDto } from './dto/comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikeDto } from './dto/like.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationEventType } from 'src/notifications/interface/create-notification';
import { User } from '@prisma/client';

@Injectable()
export class InteractionsService {

  constructor(private readonly prismaService: PrismaService, private readonly notificationsService: NotificationsService) { }

  async createComment(commentDto: CommentDto, user: User) {
    if (
      (commentDto.activity_id && commentDto.post_id) ||
      (!commentDto.activity_id && !commentDto.post_id)
    ) {
      throw new BadRequestException('Only one of activity id or post id should be provided, not both or none.');
    }

    const comment = await this.prismaService.comment.create({
      data: {
        ...commentDto,
        user_id: user.id
      }
    });

    await this.notificationsService.createNotification(
      {
        user_id: user.id,
        event_type: NotificationEventType.COMMENT_ON_ACTIVITY,
        comment_id: comment.id,
      },
      `${user.name} comentou na sua atividade.`,
    )

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

  async toggleLike(likeDto: LikeDto, user: User){
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
      comment_id ? { comment_id, user_id: user.id }
      : activity_id ? { activity_id, user_id: user.id }
      : { post_id, user_id: user.id };

    const like = await this.prismaService.like.findFirst({
      where: searchField,
    });

    if(like){
      await this.prismaService.like.delete({
        where: {
            id: like.id
          }
        });
    } else {
      const newLike = await this.prismaService.like.create({
        data: {
          user_id: user.id,
          ...likeDto
        }
      });

      const { event_type, message } = likeDto.comment_id ?
        {
          event_type: NotificationEventType.LIKE_ON_COMMENT,
          message: `${user.name} curtiu seu comentário.`,
        } : {
          event_type: NotificationEventType.LIKE_ON_ACTIVITY,
          message: `${user.name} curtiu sua atividade.`,
        };

      await this.notificationsService.createNotification(
        {
          user_id: user.id,
          event_type,
          like_id: newLike.id
        }, message
      )
    }
  }

  async toggleFollow(user: User, followed_id: string) {

    const userToFollow = await this.prismaService.user.findUnique({
      where: { id: followed_id },
    });

    if (!userToFollow) {
      throw new Error('The user you are trying to follow does not exist.');
    }

    const existingFollow = await this.prismaService.follower.findFirst({
      where: {
        followed_id,
        follower_id: user.id
      }
    })

    if (existingFollow) {
      await this.prismaService.follower.delete({
        where: {
          follower_id_followed_id: {
            follower_id: user.id,
            followed_id,
          },
        },
      });
    } else {
      await this.prismaService.follower.create({
        data: {
          follower_id: user.id,
          followed_id,
        },
      });

      await this.notificationsService.createNotification(
        {
          user_id: followed_id,
          event_type: NotificationEventType.NEW_FOLLOWER,
          followed_id,
          follower_id: user.id,
        },
        `${user.name} segiu você.`,
      )
    }
  }
}
