'use client';

import {logout} from "@/lib/actions/auth";

export function Footer() {
  async function handleLogout() {
    await logout();
  }

  return (
    <div className="text-white grid grid-cols-3 items-center">
      <span />
      <span className="text-muted-foreground text-center">© smokeybear.dev 2026</span>
      <span className="cursor-pointer text-right mr-3" onClick={handleLogout}>Logout</span>
    </div>
  )
}
