import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from '@prisma/client';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get('/')
  async listGroups(@GetUser() user:  User) {
    const groups = await this.groupsService.listGroups({userId: user.id});
    return groups;
  }

  @Get('/myGroup')
  async listMyGroups(@GetUser() user:  User){
    const groups = await this.groupsService.listGroupsByMember({ userId: user.id});
    return groups;
  }
}

