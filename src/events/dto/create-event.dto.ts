import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, IsBoolean } from 'class-validator'

export enum EEventType {
  PUBLIC = 'public',
  GROUP = 'group',
  PRIVATE = 'private'
}

export class CreateEventDto {
  @IsString({ message: 'Event name must be a string.' })
  name: string

  @IsString({ message: 'Event date must be a string.' })
  event_date: Date

  @IsString({ message: 'Address must be a string.' })
  address:  string

  @IsBoolean({ message: 'Is recurrency must be true or false.' })
  is_recurring?: boolean = false

  @IsNumber({}, { message: 'Reccurence interval must be an number and must be in days.' })
  recurrence_interval?: number

  @IsString({ message: 'Start time must be a string.' })
  start_time: Date

  @IsString({ message: 'End time must be a string.' })
  end_time: Date

  @IsString({ message: 'CEP must be a string.' })
  description?: string

  @IsEnum(EEventType, { message: 'Event type must be either "profile" or "group".' })
  event_type: string

  @IsOptional()
  @IsString({ message: 'Group id must be a string.' })
  group_id?: string
}
