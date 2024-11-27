import { Controller, Get, Sse } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorators/user.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService,  private eventEmitter: EventEmitter2) {}

  @Sse('stream')
  sseNotifications(): Observable<any> {
    return new Observable((observer) => {
      this.eventEmitter.on('notification.created', (payload) => {
        observer.next({
          data: payload,
        });
      });
    });
  }

  @Get()
  async getAllNotifications (@GetUser() user: User) {
    return this.notificationsService.getUserNotifications(user.id);
  }
}
