import "reflect-metadata";
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { SupabaseModule } from './supabase/supabase.module';
import { GroupsModule } from './groups/groups.module';
import { ActivitiesModule } from './activities/activities.module';
import { FeedModule } from './feed/feed.module';
import { InteractionsModule } from './interactions/interactions.module';
import { PostsModule } from './posts/posts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EventsModule } from './events/events.module';
import { CalendarModule } from './calendar/calendar.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MailModule,
    SupabaseModule,
    ActivitiesModule,
    GroupsModule,
    FeedModule,
    InteractionsModule,
    PostsModule,
    NotificationsModule,
    EventsModule,
    CalendarModule,
    CalendarModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
