'use client';

import {useRouter, useSearchParams} from "next/navigation";
import {useRef} from "react";
import {Input} from "@/components/ui/input";

export function SearchBar() {
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

  return (
    <Input
      placeholder="Search events"
      defaultValue={searchParams.get('search') ?? ''}
      onChange={handleSearch}
    />
  )
}