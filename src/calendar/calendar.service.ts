import { formatEventData } from 'src/utils/formatEventData';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserCalendar(user: User) {
    const events = await this.prismaService.calendar.findMany({
      where: {
        user_id: user.id
      },
      select: {
        event: {
          include: {
            group: {
              select: {
                id: true,
                name: true,
                group_image: true,
              }
            },
            user: {
              select: {
                id: true,
                name: true,
                profile_image: true,
              }
            }
          }
        }
      }
    })

    return events.map(event => formatEventData(event));
  }

  async addEventToCalendar(user: User, event_id: string){
    await this.prismaService.calendar.create({
      data: {
        event_id: event_id,
        user_id: user.id
      }
    })
  }

  async removeEventFromCalendar(user: User, event_id: string){
    await this.prismaService.calendar.delete({
      where: {
        event_id_user_id: {
          event_id: event_id,
          user_id: user.id
        }
      }
    });
  }
}
