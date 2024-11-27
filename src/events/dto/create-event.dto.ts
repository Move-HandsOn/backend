import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export enum EEventType {
  PRIVATE = 'private',
  PROFILE = 'profile',
  GROUP = 'group'
}

export class CreateEventDto {
    @IsNotEmpty({ message: 'Event name cant be empty.'})
    name: string

    @IsNotEmpty({ message: 'Event name cant be empty.'})
    @IsString({  message: 'Event date must be a string.'})
    event_date: string

    @IsNotEmpty({ message: 'Event name cant be empty.'})
    @IsString({  message: 'Address must be a string.'})
    address: string

    @IsOptional()
    is_recurring?: boolean

    @IsOptional()
    @IsNumber({}, {  message: 'Recurrence interval must be a number in days.'})
    recurrence_interval?: number

    @IsNotEmpty({ message: 'Start time cant be empty.'})
    @IsString({  message: 'Start time must be a string.'})
    start_time: string

    @IsNotEmpty({ message: 'End time cant be empty.'})
    @IsString({  message: 'End time must be a string.'})
    end_time: string

    @IsOptional()
    @IsString({  message: 'Description must be a string.'})
    description?: string

    @IsNotEmpty({ message: 'Event name cant be empty.'})
    @IsEnum(EEventType, { message: 'Event type must be private, group or profile.'})
    event_type: EEventType

    @IsOptional()
    @IsString({  message: 'Group id must be a string.'})
    group_id?: string
}
