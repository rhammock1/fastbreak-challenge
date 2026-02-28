import * as db from "@/lib/db/index";

export async function register() {
  try {
    await db.upgrade();
  } catch(err) {
    console.error('[DB] Error upgrading the database. Shutting down:', err);
    process.exit(1);
  }
}
