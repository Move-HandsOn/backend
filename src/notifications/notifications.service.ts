import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
import { ICreateNotification, NotificationEventType } from './interface/create-notification';

@Injectable()
export class NotificationsService {
  constructor( private prismaService: PrismaService,
    private eventEmitter: EventEmitter2) {}

    async createNotification(event: ICreateNotification, message: string) {
      await this.prismaService.notification.create({
        data: {
          ...event,
          message,
        },
      });

      this.eventEmitter.emit('notification.created', {
        event,
        message
      });
    }

    async getUserNotifications(user_id: string) {
      return await this.prismaService.notification.findMany({
        where: {
          user_id
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }

}
