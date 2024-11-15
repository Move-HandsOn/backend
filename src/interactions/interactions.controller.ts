import { Controller, Post, Body, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { CommentDto } from './dto/comment.dto';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorators/user.decorator';
import { LikeDto } from './dto/like.dto';

@Controller()
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post( 'comment')
  @HttpCode(HttpStatus.NO_CONTENT)
  async createComment(@Body() commentDto: CommentDto, @GetUser() user: User) {
    return this.interactionsService.createComment(commentDto, user);
  }

  @Delete('comment/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(@Param('id') id: string, @GetUser() user: User) {
    await this.interactionsService.deleteComment(id, user.id);
  }

  @Post( 'like')
  @HttpCode(HttpStatus.NO_CONTENT)
  async toggleLike(@Body() likeDto: LikeDto, @GetUser() user: User) {
    await this.interactionsService.toggleLike(likeDto, user);
  }

  @Post( 'follow/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async toggleFollow(@Param('id') id: string, @GetUser() user: User) {
    await this.interactionsService.toggleFollow( user, id, );
  }
}
