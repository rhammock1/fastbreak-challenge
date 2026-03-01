export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const db = await import('@/lib/db/index');
      await db.upgrade();
    } catch(err) {
      console.error('[DB] Error upgrading the database. Shutting down:', err);
      process.exit(1);
    }
  }
}