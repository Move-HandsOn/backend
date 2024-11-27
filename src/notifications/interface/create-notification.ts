export enum NotificationEventType {
  NEW_FOLLOWER = 'new_follower',
  LIKE_ON_ACTIVITY = 'like_on_activity',
  LIKE_ON_COMMENT = 'like_on_comment',
  COMMENT_ON_ACTIVITY = 'comment_on_activity'
}

export class ICreateNotification {
  event_type: NotificationEventType
  user_id: string
  follower_id?: string
  followed_id?: string
  comment_id?: string
  like_id?: string
}
