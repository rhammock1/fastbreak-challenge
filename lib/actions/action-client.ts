import { ActionResult } from "@/lib/types";

// Generic helper that wraps a server action callback and normalizes the return
// value into ActionResult<T>. Catches thrown errors so callers always get a
// typed success/error object instead of an unhandled exception.
//
// Usage:
//   export async function myAction(input: MyInput): Promise<ActionResult<MyData>> {
//     return actionClient(async () => {
//       const data = await doSomething(input);
//       return data;
//     });
//   }

export async function actionClient<T>(
  fn: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (err) {
    // Next.js redirect() throws a special signal — let it propagate
    if (err instanceof Error && (err as Error & { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) {
      throw err
    }
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("[APP]", err);
    return { success: false, error: message };
  }
}
