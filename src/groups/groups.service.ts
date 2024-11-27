import { SupabaseService } from 'src/supabase/supabase.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDto, GroupType } from './dto/create-group.dto';
import { FileUploadDTO } from 'src/supabase/dto/upload.dto';

@Injectable()
export class GroupsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async groupDetail(id: string) {
    return await this.prismaService.group.findMany({
      where: {
        id
      },
      include: {
        events: {
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
        activities: {
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
        groupRequests: {
          where: {
            status: 'pending'
          },
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
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profile_image: true,
              }
            }
          }
        },
        category: {
          select: {
            category_name: true
          }
        },
        admin: {
          select: {
            id: true,
            name: true,
            profile_image: true,
          }
        }
      }
    })
  }

  async listGroups(user_id: string) {
    const groups = await this.prismaService.group.findMany({
      include: {
        members: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                profile_image: true,
              },
            },
          },
        },
        groupRequests: true,
        events: true
      },
    });

    return groups.map((group) => {
      const mappedMembers = group.members.map((member) => member.user);

      const groupRequest = group.groupRequests.find(
        (request) => request.user_id === user_id && request.status !== "rejected"
      );

      const status = groupRequest
        ? "pending"
        : mappedMembers.some((member) => member.id === user_id)
        ? "joined"
        : "none";

      return {
        ...group,
        members: mappedMembers,
        status,
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
            groupRequests: {
              some: {
                user_id,
                status: {
                  not: "rejected",
                },
              },
            },
          },
        ],
      },
      include: {
        members: {
          where: {
            user_id,
          },
          select: {
            user: {
              select: {
                id: true,
                name: true,
                profile_image: true,
              },
            },
          },
        },
        events: true
      },
    });

    return groups.map((group) => {
      const isMember = group.members.length > 0;
      const status = isMember ? "joined" : "pending";

      return {
        ...group,
        status,
      };
    });
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

    await this.addGroupMember(group.id, user_id)

    return group;
  }

  async requestJoin(user_id: string, id: string) {
  const group = await this.prismaService.group.findUnique({
    where: {
      id,
    },
  });

  if (!group) {
    throw new NotFoundException('Group not found');
  }

  const existingRequest = await this.prismaService.groupRequest.findFirst({
    where: {
      group_id: id,
      user_id,
      status: 'pending'
    },
  });

  const existingMember = await this.prismaService.groupMember.findFirst({
    where: {
      group_id: id,
      user_id,
    }
  })

  if (existingRequest) {
    await this.prismaService.groupRequest.delete({
      where: {
        id: existingRequest.id,
        group_id: id,
        user_id,
      }
    })

    return {
      message: 'Join request canceled.'
    }
  }

  if (existingMember) {
    await this.prismaService.groupMember.delete({
      where: {
        group_id_user_id: {
          user_id: existingMember.user_id,
          group_id: existingMember.group_id,
        }
      }
    })

    return {
      message: 'User left the group.'
    }
  }

  if(group.group_type === GroupType.PUBLIC) {
    await this.addGroupMember( id, user_id);
    return {
      message: 'Joined.'
    };
  }



  if (group.group_type === GroupType.PRIVATE) {
    await this.prismaService.groupRequest.create({
      data: {
        group_id: id,
        user_id,
        status: 'pending'
      }
    })
  }

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

    updateData.createMember && await this.addGroupMember(group_id, request.user_id)

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

  async addGroupMember(group_id: string, member_id: string,) {
      return await this.prismaService.groupMember.create({
        data: {
            group_id,
            user_id: member_id
          }
      });
    }
}
