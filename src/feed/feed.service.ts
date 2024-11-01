import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserFeed(userId: string) {
    const friendsIds = await this.getFriendIds(userId);
    const groupIds = await this.getUserGroupIds(userId);

    const friendPosts = await this.prisma.post.findMany({
      where: {
        user_id: {
          in: friendsIds,
        },
        post_type: "profile",
      },
      include: {
        comments: {
          select: {
            id: true,
            comment_text: true,
            likes: true,
            created_at: true,
            user: {
              select: {
                id: true,
                name: true,
                profile_image: true
              }
            }
          },
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
        },
        user: {
          select: {
            name: true,
            profile_image: true
          }
        }
      },
      take: 50,
      orderBy: {
        created_at: 'desc',
      },
    });

    const groupPosts = await this.prisma.post.findMany({
      where: {
        group_id: {
          in: groupIds
        }
      },
      include:{
        user: {
          select: {
            name: true,
            profile_image: true
          }
        },
        comments: true,
        likes: true,
      },
      take: 50,
    });

    const friendActivities = await this.prisma.activity.findMany({
      where: {
        user_id: {
          in: friendsIds
        },
        post_type: 'profile'
      },
      take: 50,
    });

    const groupActivities = await this.prisma.activity.findMany({
      where: {
        user_id: {
          in: groupIds
        }
      },
      take: 50,
    });

    return {
      posts: [
        ...friendPosts,
        ...groupPosts,
      ],
      activities: [
        ...friendActivities,
        ...groupActivities
      ]
    };
  }

  private async getFriendIds(userId: string) {
    const friends = await this.prisma.follower.findMany({
      where: {
        follower_id: userId
      },
      select: {
        followed_id: true
      },
    });

    return friends.map((f) => f.followed_id);
  }

  private async getUserGroupIds(userId: string) {
    const groups = await this.prisma.groupMember.findMany({
      where: {
        user_id: userId
      },
      select: {
        group_id: true
      },
    });

    return groups.map((g) => g.group_id);
  }
}
