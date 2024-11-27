import { CreateGroupDto } from './dto/create-group.dto';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDTO } from 'src/supabase/dto/upload.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  async listGroups(@GetUser() user:  User) {
    const groups = await this.groupsService.listGroups(user.id);
    return groups;
  }

  @Get('/:id/requests')
  async getGroupRequests(@GetUser() user:  User, @Param('id') id: string, ) {
    return await this.groupsService.listGroupRequests(id, user.id);
  }


  @Get('/myGroup')
  async listMyGroups(@GetUser() user:  User){
    const groups = await this.groupsService.listGroupsByMember(user.id);
    return groups;
  }

  @UseInterceptors(FileInterceptor('group_image'))
  @Post()
  async createGroup(@GetUser() user:  User, @Body() createGroupDto: CreateGroupDto, @UploadedFile() file?: FileUploadDTO){
    return await this.groupsService.createGroup(createGroupDto, user.id, file)
  }

  @Get('/:id')
  async groupDetail(@GetUser() user:  User, @Param('id') id: string, ) {
    return await this.groupsService.groupDetail(id);
  }

  @Post('/:id/requests')
  async requestJoinGroup(@GetUser() user:  User, @Param('id') id: string, ) {
    return await this.groupsService.requestJoin(user.id, id);
  }

  @Patch('/:id/requests/:action/:reqId')
  async respondJoinRequest(
    @GetUser() user: User, @Param('id') id: string,
    @Param('reqId') req_id: string,
    @Param('action') action: 'accept' | 'reject',
  ) {
    return await this.groupsService.respondJoinRequest(id, req_id, action, user.id  )
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async deleteGroup(@GetUser() user: User, @Param('id') id: string) {
    await this.groupsService.deleteGroup(id, user.id)
  }
}

