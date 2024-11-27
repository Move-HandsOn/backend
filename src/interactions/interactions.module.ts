import { Module } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { InteractionsController } from './interactions.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Module({
  controllers: [InteractionsController],
  providers: [PrismaService, InteractionsService, NotificationsService],
})
export class InteractionsModule {}
