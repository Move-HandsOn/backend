import { User } from '@prisma/client';
import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { FileUploadDTO } from 'src/supabase/dto/upload.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/decorators/user.decorator';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post('new')
  @UseInterceptors(FilesInterceptor('files'))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createActivityDto: CreateActivityDto, @UploadedFiles() files: FileUploadDTO[], @GetUser() user: User) {
    return await this.activitiesService.create(createActivityDto, user.id, files);
  }

  @Get()
  async findAll(@GetUser() user: User) {
    const activities = await this.activitiesService.findAll(user.id);

    if(!activities){
      throw new NotFoundException( 'No activities found for the specified user.');
    }

    return activities;
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    const activity = await this.activitiesService.findOne(id, user.id);

    if(!activity){
      throw new NotFoundException( `No activity was found for the given ID: ${id}.`);
    }

    return activity;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: User) {
    await this.activitiesService.remove(id, user.id);
    return
  }
}
