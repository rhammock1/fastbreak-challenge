import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {SPORT_TYPES} from '../types';

export const eventSchema = z.object({
  event_name: z.string().min(1, 'Event name is required'),
  event_description: z.string().optional(),
  event_sport_type: z.enum(SPORT_TYPES),
  event_start_time: z.string().min(1, 'Event start time is required'),
  event_end_time: z.string().min(1, 'Event end time is required'),
  event_venues: z.array(z.string()).min(1, 'At least one venue is required'),
});

export type EventFormValues = z.infer<typeof eventSchema>;
export const eventResolver = zodResolver(eventSchema);
