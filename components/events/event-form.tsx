'use client';

import {useRouter} from "next/navigation";
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {Event, Venue, SPORT_TYPES} from '@/lib/types';
import {createEvent, updateEvent} from '@/lib/actions/events';
import {EventFormValues, eventResolver} from '@/lib/validations/events';

import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Props = {
  event?: Event  // if present = edit mode, if absent = create mode
  venues: Venue[]
}

function toDateTimeLocal(value: string | Date) {
  const date = new Date(value)
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

/**
 * Returns the current timezone in a human-readable format (e.g. "EDT"). Falls back to the IANA timezone name (e.g. "America/New York") if the short name is not available.
 */
function getTimezoneLabel() {
  const parts = Intl.DateTimeFormat(undefined, {timeZoneName: 'short'}).formatToParts(new Date())
  return parts.find(p => p.type === 'timeZoneName')?.value 
    ?? Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, ' ')
}

export function EventForm({event, venues}: Props) {
  const router = useRouter()
  const isEditing = !!event

  const form = useForm<EventFormValues>({
    resolver: eventResolver,
    defaultValues: event 
      ? {
        event_name: event.event_name,
        event_description: event.event_description ?? '',
        event_sport_type: event.event_sport_type,
        event_start_time: toDateTimeLocal(event.event_start_time),
        event_end_time: toDateTimeLocal(event.event_end_time),
        event_venues: event.event_venues.map(v => v.venue_uuid),
      } 
      : {
        event_name: '',
        event_description: '',
        event_sport_type: SPORT_TYPES[0],
        event_start_time: '',
        event_end_time: '',
        event_venues: [],
      },
  })

  async function onSubmit(values: EventFormValues) {
    const payload: EventFormValues = {
      ...values,
      event_start_time: new Date(values.event_start_time).toISOString(),
      event_end_time: new Date(values.event_end_time).toISOString(),
    }
    const result = isEditing
      ? await updateEvent(event.event_uuid, payload)
      : await createEvent(payload)

    if (result.success) {
      toast.success(isEditing ? 'Event updated' : 'Event created')
      router.push(isEditing ? `/events/${event.event_uuid}` : '/dashboard')
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <FormField
          control={form.control}
          name="event_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Spring Classic Invitational" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="event_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Optional event description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="event_sport_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sport Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sport" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SPORT_TYPES.map(sport => (
                    <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4 mb-0">
          <FormField
            control={form.control}
            name="event_start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="event_end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">Times are in your local timezone ({getTimezoneLabel()})</p>

        <FormField
          control={form.control}
          name="event_venues"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venues</FormLabel>
              <div className="flex flex-wrap gap-2">
                {venues.map(venue => {
                  const isSelected = field.value?.includes(venue.venue_uuid)
                  return (
                    <button
                      key={venue.venue_uuid}
                      type="button"
                      onClick={() => {
                        const current = field.value ?? []
                        field.onChange(
                          isSelected
                            ? current.filter(id => id !== venue.venue_uuid)
                            : [...current, venue.venue_uuid]
                        )
                      }}
                      className={['rounded-full border px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer',
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-foreground border-input hover:bg-accent'
                      ].join(' ')}
                    >
                      {venue.venue_name}
                    </button>
                  )
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? isEditing ? 'Saving...' : 'Creating...'
              : isEditing ? 'Save Changes' : 'Create Event'
            }
          </Button>
          <Button className="text-black" type="button" variant="outline" onClick={() => router.push(isEditing ? `/events/${event.event_uuid}` : '/dashboard')}>
            Cancel
          </Button>
        </div>

      </form>
    </Form>
  )
}