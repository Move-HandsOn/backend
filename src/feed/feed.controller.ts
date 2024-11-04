import { User } from '@prisma/client';
import { Controller, Get, Query } from '@nestjs/common';
import { FeedService } from './feed.service';
import { GetUser } from 'src/decorators/user.decorator';

@Controller()
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('feed')
  async userFeed(@GetUser() user: User) {
    return await this.feedService.getUserFeed(user.id);
  }

  @Get('search')
  async search(
    @GetUser() user: User,
    @Query('text') text: string,
    @Query('filters') filters: string[]
  ) {
    return await this.feedService.searchFilter(user.id, text, filters);
  }
}
