import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto, PostType } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prismaService: PrismaService) {}

  async create(createPostDto: CreatePostDto, user_id: string) {
    if (createPostDto.post_type === PostType.PROFILE && createPostDto.group_id) {
        throw new BadRequestException('Group ID should not be provided when post type is "profile".');
    }

    const post = await this.prismaService.post.create({
      data: {
        ...createPostDto,
        user_id
      }
    })

    return post;
  }

  async getAll() {
    return await this.prismaService.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile_image: true
          }
        },
        comments: {
          select: {
            id: true,
            comment_text: true,
            created_at: true,
            likes: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    profile_image: true
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
          }
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profile_image: true
              }
            }
          }
        }
      }
    })
  }

  getMyPosts(user_id: string) {
    return this.prismaService.post.findMany({
      where: {
        user_id
      },
      include: {
        comments: {
          select: {
            id: true,
            comment_text: true,
            created_at: true,
            likes: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    profile_image: true
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
          }
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profile_image: true
              }
            }
          }
        }
      }
    })
  }

  async findOne(id: string) {
    const post = await this.prismaService.post.findFirst({
      where: {
        id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile_image: true
          }
        },
        comments: {
          select: {
            id: true,
            comment_text: true,
            created_at: true,
            likes: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    profile_image: true
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
          }
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profile_image: true
              }
            }
          }
        }
      }
    })

    if (!post) {
      throw new NotFoundException('Post not found.')
    }

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, user_id: string) {
    const post = await this.prismaService.post.findFirst({
      where:{
        id,
        user_id,
        post_type: PostType.PROFILE
      }
    })

    if (!post) {
      throw new NotFoundException('Post not found.')
    }

    const updatedPost = await this.prismaService.post.update({
      where: {
          id,
          user_id
      },
      data: {
        post_content: updatePostDto.post_content
      }
    })

    return updatedPost;
  }

  async remove(id: string, user_id: string) {
    const post = await this.prismaService.post.findFirst({
      where:{
        id,
        user_id
      }
    })

    if (!post) {
      throw new NotFoundException('Post not found.')
    }

    await this.prismaService.post.delete({
      where: {
        id,
        user_id
      }
    })
  }
}
