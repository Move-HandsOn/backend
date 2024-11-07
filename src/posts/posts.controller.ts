import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, HttpStatus, HttpCode } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorators/user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    return await this.postsService.create(createPostDto, user.id);
  }

  @Get()
  async findAll() {
    return await this.postsService.getAll();
  }

  @Get('myPosts')
  async getMyPosts(@GetUser() user: User) {
    return await this.postsService.getMyPosts(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.postsService.findOne(id);
  }


  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @GetUser() user: User) {
    return await this.postsService.update(id, updatePostDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.postsService.remove(id, user.id);
  }
}
