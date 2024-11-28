import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorators/user.decorator';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  async getUserCalendar(@GetUser() user: User, @Query('start_date') start_date?: string, @Query('end_date') end_date?: string) {
    return await this.calendarService.getUserCalendar(user, start_date, end_date);
  }

  @Post('/:id')
  async addToCalendar(@Param('id') id: string, @GetUser() user: User) {
    return await this.calendarService.addEventToCalendar(user, id)
  }

  @Delete('/:id')
  async removeFromCalendar(@Param('id') id: string, @GetUser() user: User) {
    return await this.calendarService.removeEventFromCalendar(user, id)
  }
}
