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
      },
      select: {
        id: true,
        comment_text: true,
        created_at: true,
        user: {
          select: {
            id: true,
            name: true,
            profile_image: true,
          }
        },
        likes: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                profile_image: true,
              }
            }
          }
        }
      }
    });

    const { user: author } = await this.prismaService.activity.findFirst({
      where: {
        id: commentDto.activity_id
      },
      select: {
        user: {
          select: {
            id: true
          }
        }
      }
    })

    await this.notificationsService.createNotification(
      {
        user_id: author.id,
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

  async toggleLike(likeDto: LikeDto, user: User) {
    const { comment_id, activity_id, post_id } = likeDto;

  this.validateLikeDto(comment_id, activity_id, post_id);

  const searchField = this.getSearchField(comment_id, activity_id, post_id, user.id);

  await this.prismaService.$transaction(async (prisma) => {
    const existingLike = await prisma.like.findFirst({
      where: searchField
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return;
    }

    const authorId = await this.getAuthorId(comment_id, activity_id);

    const newLike = await prisma.like.create({
      data: {
        user_id: user.id,
        ...likeDto,
      },
    });

    const { event_type, message } = this.getNotificationDetails(comment_id, activity_id, user.name);

    await this.notificationsService.createNotification(
      {
        user_id: authorId,
        event_type,
        like_id: newLike.id,
      },
      message,
    );
  });
  }

  private validateLikeDto(comment_id: string, activity_id: string, post_id: string) {
    const conditions = [
      (comment_id && activity_id),
      (comment_id && post_id),
      (activity_id && post_id),
      (!comment_id && !activity_id && !post_id),
    ];

    if (conditions.some((condition) => condition)) {
      throw new BadRequestException(
        'Only one of activity id, post id or comment id should be provided, not both or none.',
      );
    }
  }

  private getSearchField(comment_id: string, activity_id: string, post_id: string, userId: string) {
    if (comment_id) return { comment_id, user_id: userId };
    if (activity_id) return { activity_id, user_id: userId };
    return { post_id, user_id: userId };
  }

  private async getAuthorId(comment_id?: string, activity_id?: string): Promise<string> {
    if (comment_id) {
      const comment = await this.prismaService.comment.findUnique({
        where: { id: comment_id },
        select: { user: { select: { id: true } } },
      });
      if (!comment) throw new NotFoundException('Comment not found.');
      return comment.user.id;
    }

    if (activity_id) {
      const activity = await this.prismaService.activity.findUnique({
        where: { id: activity_id },
        select: { user: { select: { id: true } } },
      });
      if (!activity) throw new NotFoundException('Activity not found.');
      return activity.user.id;
    }

    throw new BadRequestException('Invalid data.');
  }

  private getNotificationDetails(comment_id: string, activity_id: string, userName: string) {
    if (comment_id) {
      return {
        event_type: NotificationEventType.LIKE_ON_COMMENT,
        message: `${userName} curtiu seu comentário.`,
      };
    }

    if (activity_id) {
      return {
        event_type: NotificationEventType.LIKE_ON_ACTIVITY,
        message: `${userName} curtiu sua atividade.`,
      };
    }
  }
}
