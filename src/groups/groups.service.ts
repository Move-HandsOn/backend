import { SupabaseService } from 'src/supabase/supabase.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { FileUploadDTO } from 'src/supabase/dto/upload.dto';

@Injectable()
export class GroupsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async listGroups(user_id: string){
    const groups = await this.prismaService.group.findMany({
      include: {
        members: true
    }})

    return groups.map((group) => {
      const isParticipation = group.members.some(
        (member) => member.user_id === user_id,
      );

      return {
        ...group,
        isParticipation,
      };
    });
  }

  async listGroupsByMember(user_id: string){
    const groups = await this.prismaService.group.findMany({
      where: {
        OR: [
          {
            members: {
              some: {
                user_id,
              },
            },
          },
          {
            admin_id: user_id,
          },
        ],
      },
      include: {
        members: {
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

    })
    return groups;
  }

  async createGroup(createGroupDto: CreateGroupDto, user_id: string, file: FileUploadDTO) {

    const { friend_ids, category_name, ...groupData } = createGroupDto;

    const category = await this.prismaService.category.findFirst({
      where: {
        category_name: category_name.toLowerCase()
      }
    })

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    const group = await this.prismaService.group.create({
      data: {
        ...groupData,
        admin_id: user_id,
        category_id: category.id
      },
    });

    if(file) {
      const media_url = await this.supabaseService.upload(file);
      await this.prismaService.media.create({
        data: {
          media_url,
          user_id,
          group_id: group.id
        }
      })
    }

    if(friend_ids && friend_ids.length > 0) {
      await this.prismaService.groupMember.createMany({
        data: friend_ids.map((friend_id) => ({
          group_id: group.id,
          user_id: friend_id,
        })),
      });
    }

    return group;
  }

  async requestJoin(user_id: string, id: string) {
    console.log(id)
  const group = await this.prismaService.group.findUnique({
    where: {
      id
    },
  });

  if (!group) {
    throw new NotFoundException('Group not found');
  }

  const existingRequest = await this.prismaService.groupRequest.findFirst({
    where: {
      id,
      user_id
    },
  });

  if (existingRequest) {
    throw new BadRequestException(`The request for join group has already been made and is with the state: ${existingRequest.status}.`);
  }

  await this.prismaService.groupRequest.create({
    data: {
      group_id: id,
      user_id,
    },
  });

  return {
    message: 'Join request sent.'
  };
}


  async respondJoinRequest(group_id: string, request_id: string, action: 'accept' | 'reject', admin_id: string) {
    const group = await this.prismaService.group.findUnique({
      where: {
        id: group_id,
        admin_id
      },
    });

    if (!group) throw new NotFoundException('Group not found.');

    const request = await this.prismaService.groupRequest.findUnique({
      where: {
        id: request_id
      },
    });

    if (!request || request.status !== 'pending') {
      throw new NotFoundException('No pending request found.');
    }

    const updateData = {
      accept: {
        status: 'accepted',
        createMember: true,
      },
      reject: {
        status: 'rejected',
        createMember: false,
      },
    }[action];

    if (!updateData) {
      throw new BadRequestException('Invalid action.');
    }

    await this.prismaService.groupRequest.update({
      where: {
        id: request_id
      },
      data: {
        status: updateData.status
      },
    });

    updateData.createMember && await this.prismaService.groupMember.create({
        data: {
          group_id,
          user_id: request.user_id,
        },
      });

    return;
  }

  async listGroupRequests(group_id: string, admin_id: string) {
    const group = await this.prismaService.group.findUnique({
      where: {
        id: group_id,
        admin_id
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found.');
    }

    const requests = await this.prismaService.groupRequest.findMany({
      where: {
        group_id: group_id,
        status: 'pending',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile_image: true,
            followers: {
              select: {
                follower: {
                  select: {
                    id: true,
                    name: true,
                    profile_image: true
                  }
                }
              }
            },
            following: {
              select: {
                follower: {
                  select: {
                    id: true,
                    name: true,
                    profile_image: true
                  }
                }
              }
            }
          }
        },
      },
    });

    return requests;
  }

  async deleteGroup (group_id: string, admin_id: string) {
    const group = await this.prismaService.group.findUnique({
      where: {
        id: group_id,
        admin_id
      }
    })

    if(!group) {
      throw new BadRequestException("Can't delete a group that doesn't exist or that you're not the admin of. ");
    }

    await this.prismaService.group.delete({
      where: {
        id: group_id,
        admin_id
      }
    })
  }
}
