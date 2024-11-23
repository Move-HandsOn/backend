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
          user_id: event.user_id,
          event_type: event.event_type,
          followed_id: event.followed_id,
          follower_id: event.follower_id,
          message,
        },
      });

      this.eventEmitter.emit('notification.created', {
        event,
        message
      });
    }

    async getUserNotifications(user_id: string) {
      const notifications =  await this.prismaService.notification.findMany({
        where: {
          user_id
        },
        include: {
          like: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  profile_image: true
                }
              }
            }
          },
          Follower: {
            where: {
              followed_id: user_id
            },
            select: {
              follower: {
                select: {
                  id: true,
                  name: true,
                  profile_image: true
                }
              }
            }
          }
          ,
          comment: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  profile_image: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return notifications.map(notification => ({
        ...notification,
        follower: notification.Follower?.follower || null,
        Follower: undefined
      }));
    }
}
