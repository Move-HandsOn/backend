import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationEventType } from './interface/create-notification';

@Injectable()
export class NotificationsListener {

  @OnEvent('notification.created')
  handleNotificationEvent(payload: {
    user_id: string;
    event: NotificationEventType;
    message: string
  }) {
    return payload;
  }
}
