import { describe, it, expect } from "vitest";
import { actionClient } from "@/lib/actions/action-client";

describe("actionClient", () => {
  it("returns success with data when the callback resolves", async () => {
    const result = await actionClient(async () => ({ id: "1", name: "Test Event" }));

    expect(result).toEqual({ success: true, data: { id: "1", name: "Test Event" } });
  });

  it("returns failure with error message when the callback throws an Error", async () => {
    const result = await actionClient(async () => {
      throw new Error("Something went wrong");
    });

    expect(result).toEqual({ success: false, error: "Something went wrong" });
  });

  it("returns a generic message when the callback throws a non-Error value", async () => {
    const result = await actionClient(async () => {
      throw "not an error object";
    });

    expect(result).toEqual({ success: false, error: "An unexpected error occurred." });
  });

  it("returns success with void data when the callback returns nothing", async () => {
    const result = await actionClient(async () => {});

    expect(result).toEqual({ success: true, data: undefined });
  });
});
