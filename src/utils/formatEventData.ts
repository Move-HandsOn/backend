import { Event } from '@prisma/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function formatEventData(event: Event) {
  const formattedDate = format(new Date(event.event_date), 'eeee, dd MMMM yyyy', { locale: ptBR });

  const startTimeFormatted = format(new Date(event.start_time), 'HH:mm', { locale: ptBR });
  const endTimeFormatted = format(new Date(event.end_time), 'HH:mm', { locale: ptBR });

  return {
    ...event,
    event_date: formattedDate,
    start_time: startTimeFormatted,
    end_time: endTimeFormatted,
  };
}
