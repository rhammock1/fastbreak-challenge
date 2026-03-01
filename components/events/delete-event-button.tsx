'use client';

import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {archiveEvent} from "@/lib/actions/events";

export function DeleteEventButton({event_uuid}: {event_uuid: string}) {
  const router = useRouter();

  async function handleArchive() {
    const result = await archiveEvent(event_uuid);
    if(result.success) {
      toast.success('Event archived');
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleArchive}>
      Archive
    </Button>
  )
}