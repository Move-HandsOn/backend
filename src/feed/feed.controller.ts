import { User } from '@prisma/client';
import { Controller, Get } from '@nestjs/common';
import { FeedService } from './feed.service';
import { GetUser } from 'src/decorators/user.decorator';

@Controller()
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('feed')
  async userFeed(@GetUser() user: User) {
    return await this.feedService.getUserFeed(user.id);
  }
}
