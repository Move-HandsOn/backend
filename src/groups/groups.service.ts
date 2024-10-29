import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GroupsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async listGroups({ userId }: { userId: string}){
    const groups = await this.prismaService.group.findMany({ include: {
      members: true
    }})

    return groups.map((group) => {
      const isParticipation = group.members.some(
        (member) => member.user_id === userId,
      );

      return {
        ...group,
        isParticipation,
      };
    });
  }

  async listGroupsByMember({ userId }: { userId: string}){
    const groups = await this.prismaService.group.findMany({ where: {
      members: {
        some: {
          user_id: userId
        }
      }
    }})
    return groups;
  }
}
