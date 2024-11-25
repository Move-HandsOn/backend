// import formatEventData from 'src/utils/formatEventData';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserCalendar(user: User,  date?: string) {
    const filterQueries = {
      withDate: async () => this.prismaService.calendar.findMany({
        where: {
          user_id: user.id,
          event: {
            event_date: new Date(date),
          }
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
      }),
      withoutDate: async () => this.prismaService.calendar.findMany({
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
    };

    const calendarData = date
      ? await filterQueries.withDate()
      : await filterQueries.withoutDate();

    return calendarData.map(data => {
      return {
        ...data,
        event: data.event
      };
    });
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
