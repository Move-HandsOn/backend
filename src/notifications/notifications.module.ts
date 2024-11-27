import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaService],
})
export class NotificationsModule {}
