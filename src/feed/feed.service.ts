import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserFeed(userId: string) {
    const groupIds = await this.getUserGroupIds(userId);

    const friendPosts = await this.prismaService.post.findMany({
      where: {
        post_type: "profile",
      },
      include: {
        comments: {
          select: {
            id: true,
            comment_text: true,
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
            id: true,
            name: true,
            profile_image: true
          }
        }
      },
      take: 50,
      orderBy: {
        created_at: 'asc',
      },
    });

    const groupPosts = await this.prismaService.post.findMany({
      where: {
        group_id: {
          in: groupIds
        }
      },
      include: {
        comments: {
          select: {
            id: true,
            comment_text: true,
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
            id: true,
            name: true,
            profile_image: true
          }
        }
      },
      take: 50,
      orderBy: {
        created_at: 'asc',
      },
    });

    const friendActivities = await this.prismaService.activity.findMany({
      where: {
        post_type: 'profile'
      },
      include: {
        comments: {
          select: {
            id: true,
            comment_text: true,
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
            id: true,
            name: true,
            profile_image: true
          }
        }
      },
      take: 50,
      orderBy: {
        created_at: 'asc',
      },
    });

    const groupActivities = await this.prismaService.activity.findMany({
      where: {
        user_id: {
          in: groupIds
        }
      },
      include: {
        comments: {
          select: {
            id: true,
            comment_text: true,
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
            id: true,
            name: true,
            profile_image: true
          }
        }
      },
      take: 50,
      orderBy: {
        created_at: 'asc',
      },
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
    const friends = await this.prismaService.follower.findMany({
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
    const groups = await this.prismaService.groupMember.findMany({
      where: {
        user_id: userId
      },
      select: {
        group_id: true
      },
    });

    return groups.map((g) => g.group_id);
  }

  async searchFilter(userId: string, text: string, filters: string[] = []){
    const groupIds = await this.getUserGroupIds(userId);

    const filterQueries = {
      users: () => this.prismaService.user.findMany({
        where: {
          name: {
            contains: text,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          name: true,
          profile_image: true
        }
      }),
      groups: () => this.prismaService.group.findMany({
        where: {
          name: {
            contains: text,
            mode: 'insensitive',
          }
        },
        select: {
          id: true,
          name: true,
          group_image: true
        }
      }),
      posts: () => this.prismaService.post.findMany({
        where: {
          OR: [
            {
              post_type: 'profile',
            },
            {
              post_type: 'group',
              group_id: {
                in: groupIds
              }
            }
          ],
          post_content: {
            contains: text,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          post_content: true,
          user: true
        }
      }),
    };

    const results = {
      users: [],
      groups: [],
      posts: [],
    };

    const filterKeys = filters.length > 0 ? Array(filters) : ['users', 'groups', 'posts'];

    await Promise.all(filterKeys.map(async (filter) => {
      if (filterQueries[filter]) {
        results[filter] = await filterQueries[filter]();
      }
    }));

    return results;
  }
}
