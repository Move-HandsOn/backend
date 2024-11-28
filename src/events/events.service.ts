import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto, EEventType } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { toZonedTime } from 'date-fns-tz';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createEventDto: CreateEventDto, user: User) {
    this.validateCreateEventDto(createEventDto);

    return await this.prismaService.$transaction(async (prisma) => {
      const event = await prisma.event.create({
        data: {
          ...createEventDto,
          user_id: user.id,
          event_date: toZonedTime(new Date(createEventDto.event_date), 'America/Sao_Paulo'),
          end_time: toZonedTime(new Date(createEventDto.end_time), 'America/Sao_Paulo'),
          start_time: toZonedTime(new Date(createEventDto.start_time), 'America/Sao_Paulo'),
        },
      });

      await prisma.calendar.create({
        data: {
          event_id: event.id,
          user_id: user.id,
        },
      });

      return event;
    })
  }

  async findAll(user: User) {
    return await this.prismaService.event.findMany({
      where: {
        user_id: user.id,
      }
    })
  }

  async findOne(id: string, user: User) {
    const event = await this.prismaService.event.findUnique({
      where: {
        id,
        user_id: user.id
      }
    })

    if(!event) {
      throw new NotFoundException('Event not found.')
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto, user: User) {
    const event = await this.prismaService.event.findUnique({
      where: {
        id,
        user_id: user.id
      }
    });

    if (!event) {
      throw new NotFoundException('Event not found.');
    }

    this.validateUpdateEventDto(updateEventDto, event);

    return await this.prismaService.event.update({
      where: { id },
      data: updateEventDto,
    });
  }

  async remove(id: string, user: User) {
    const event = await this.prismaService.event.findUnique({
      where: {
        id,
        user_id: user.id
      }
    })

    if(!event) {
      throw new NotFoundException('Event not found.')
    }

    await this.prismaService.event.delete({
      where: {
        id,
        user_id: user.id
      },
    })
  }

  validateCreateEventDto (eventDto: CreateEventDto) {
    if (
      (eventDto.event_type === EEventType.GROUP && !  eventDto.group_id) ||
      (eventDto.event_type !== EEventType.GROUP &&  eventDto.group_id)
    ) {
      throw new BadRequestException(
          eventDto.event_type === EEventType.GROUP
          ? 'The "group_id" field is required for events of type GROUP.'
          : 'The "group_id" field must not be provided for events that are not of type GROUP.'
      );
    }

    if (
      (eventDto.is_recurring && ! eventDto.recurrence_interval) ||
      (!eventDto.is_recurring &&  eventDto.recurrence_interval)
    ) {
      throw new BadRequestException(
          eventDto.is_recurring
          ? 'The "recurrence_interval" field is required for recurring events.'
          : 'The "recurrence_interval" field must not be provided for non-recurring events.'
      );
    }
  }


  validateUpdateEventDto(updateEventDto: UpdateEventDto, event: any) {
    const { event_type, group_id } = updateEventDto;

    if (event.event_type === EEventType.GROUP && event_type !== EEventType.GROUP) {
      throw new BadRequestException('You cannot change the event type from "group" to another type.');
    }

    if (event.event_type !== EEventType.GROUP && event_type === EEventType.GROUP) {
      throw new BadRequestException('You cannot change the event type to "group" from another type.');
    }

    if (group_id && group_id !== event.group_id) {
      throw new BadRequestException('You cannot change the group of the event.');
    }
  }
}
