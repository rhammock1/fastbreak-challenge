import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {Footer} from "@/components/footer/footer";

// All routes nested under (dashboard) are protected.
// Middleware handles the redirect, but this is a server-side
// safety net in case middleware is bypassed.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
