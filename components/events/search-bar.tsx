'use client';

import {useRouter, useSearchParams} from "next/navigation";
import {useRef} from "react";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {SPORT_TYPES} from "@/lib/types";

export function SearchBar({available_event_dates}: {available_event_dates: string[]}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    if(debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if(e.target.value) {
        params.set('search', e.target.value);
      } else {
        params.delete('search');
      }
      router.push(`/dashboard?${params.toString()}`);
    }, 500);
  }

  function handleSportType(value: string) {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set('sport_type', value);
    } else {
      params.delete('sport_type');
    }
    router.push(`/dashboard?${params.toString()}`);
  }

  function handleEventDay(value: string) {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set('event_day', value);
    } else {
      params.delete('event_day');
    }
    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center text-white">
      <Input
        placeholder="Search events"
        defaultValue={searchParams.get('search') ?? ''}
        onChange={handleSearch}
      />
      <div className="flex gap-2 justify-center">
        <Select
          defaultValue={searchParams.get('sport_type') ?? 'all'}
          onValueChange={handleSportType}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sports</SelectItem>
            {SPORT_TYPES.map(sport => (
              <SelectItem key={sport} value={sport}>{sport}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          defaultValue={searchParams.get('event_day') ?? 'all'}
          onValueChange={handleEventDay}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All dates</SelectItem>
            {available_event_dates.map((date, index) => (
              <SelectItem key={`event-date-${index}`} value={date}>{date}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}