import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventDto, EEventType } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createEventDto: CreateEventDto, user: User) {
    this.validateCreateEventDto(createEventDto);

    const event = await this.prismaService.event.create({
      data: {
        user_id: user.id,
        end_time: new Date(createEventDto.end_time),
        start_time: new Date(createEventDto.start_time),
        event_date: new Date(createEventDto.event_date),
        ...createEventDto
      }
    })

    return event;
  }

  findAll(user_id: string) {
    return this.prismaService.event.findMany({
      where: {
        user_id
      }
    })
  }

  findOne(user_id: string, id: string) {
    return this.prismaService.event.findMany({
      where: {
        id,
        user_id
      }
    })
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: string) {
    return `This action removes a #${id} event`;
  }

  private validateCreateEventDto(createEventDto: CreateEventDto) {
    const { event_type, group_id, is_recurring, recurrence_interval } = createEventDto;

    const isGroupEvent = event_type === EEventType.GROUP;
    const hasGroupId = !!group_id;

    if ((isGroupEvent && !hasGroupId) || (!isGroupEvent && hasGroupId)) {
      throw new BadRequestException(
        'Group ID is required for events of type "group" and must be null for other event types.'
      );
    }

    if ((is_recurring && !recurrence_interval) || (!is_recurring && recurrence_interval)) {
      throw new BadRequestException(
        'Recurrence interval is required for recurring events and must be null for non-recurring events.'
      );
    }
  }
}
