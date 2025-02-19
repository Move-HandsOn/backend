import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { FileUploadDTO } from 'src/supabase/dto/upload.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService
  ) {}

  async create(createActivityDto: CreateActivityDto, userId: string, files: FileUploadDTO[]) {

    const normalizedCategoryName = this.normalizeString(createActivityDto.category_name).toLowerCase();

    const category = await this.prismaService.category.findFirst({
      where: {
        category_name: normalizedCategoryName
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const activityData = {
      post_type: createActivityDto.post_type,
      duration: +createActivityDto.duration,
      activity_date: new Date(createActivityDto.activity_date),
      description: createActivityDto.description,
      user_id: userId,
      category_id: category.id,
      group_id: createActivityDto.group_id
    };

    const activity = await this.prismaService.$transaction(async (prisma) => {

      const createdActivity = await prisma.activity.create({
        data: activityData,
      });

      if(files && files.length > 0) {
        const uploadedFileUrls = await this.supabaseService.uploadMany(files)

        const mediaPromises = uploadedFileUrls.map((fileUrl) =>
            prisma.media.create({
                data: {
                    media_url: fileUrl,
                    activity_id: createdActivity.id,
                }
            })
        );
        await Promise.all(mediaPromises);
      }

      return createdActivity;
    }, {
        timeout: 30000,
    });

    return await this.findOne( activity.id, userId);
  }

  async findAll(userId: string) {
    const activities = await this.prismaService.activity.findMany({
      where: {
        user_id: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile_image: true
          }
        },
        media: {
            select: {
                media_url: true
            }
        },
        comments: {
          select: {
            id: true,
            comment_text: true,
            created_at: true,
            user: {
              select: {
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

    if (!activities) {
      return null;
    }

    return activities.map(activity => {
      return {
        ...activity,
        like_count: activity.likes.length ?? 0,
      }
    })
  }

  async findOne(id: string, userId: string) {
    const activity = await this.prismaService.activity.findUnique({
      where: {
        id: id,
        user_id: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile_image: true
          }
        },
        media: {
            select: {
                media_url: true
            }
        },
        comments: {
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

    if (!activity) {
      return null;
    }

    return {
      ...activity,
      like_count: activity.likes.length ?? 0,
    };
  }

  async remove(id: string, userId: string) {

    const activity = await this.findOne(id, userId);

    if (!activity) {
      throw new BadRequestException('Activity not found.');
    }

    const mediaUrls = activity.media.map(media => media.media_url);

    await this.prismaService.$transaction(async (prisma) => {
      await prisma.activity.delete({
          where: {
              id: id,
              user_id: userId
          }
      });

      if (mediaUrls.length > 0) {
        await this.supabaseService.deleteMany(mediaUrls);
      }

    }, {
      timeout: 30000,
    });

    return;
  }

  normalizeString(str: string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
