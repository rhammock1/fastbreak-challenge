import { describe, it, expect, vi, beforeEach } from "vitest";
import path from "path";

// Mirrors the resolution in lib/db/index.ts: process.cwd() + /lib/ + the path argument
const resolved = (filePath: string) => path.join(process.cwd(), "lib", filePath);

// vi.hoisted runs before any imports — needed because lib/db/index.ts
// creates the Pool and reads DATABASE_URL at module load time.
const { mockQuery, mockOn, mockReadFileSync } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
  mockOn: vi.fn(),
  mockReadFileSync: vi.fn(),
}));

vi.hoisted(() => {
  process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/testdb";
});

vi.mock("pg", () => ({
  Pool: vi.fn().mockImplementation(function () {
    return { query: mockQuery, on: mockOn };
  }),
}));

vi.mock("fs", () => ({
  default: { readFileSync: mockReadFileSync },
  readFileSync: mockReadFileSync,
}));

vi.mock("@/lib/log", () => ({
  log: vi.fn(),
}));

// Import after mocks are registered
import * as db from "@/lib/db/index";

describe("db.file", () => {
  beforeEach(() => {
    mockQuery.mockReset();
    mockReadFileSync.mockReset();
  });

  describe("cache behavior", () => {
    it("reads the file from disk on the first call", async () => {
      mockReadFileSync.mockReturnValue("SELECT 1");
      mockQuery.mockResolvedValue({ rows: [] });

      await db.file("db/events/get.sql");

      expect(mockReadFileSync).toHaveBeenCalledOnce();
      expect(mockReadFileSync).toHaveBeenCalledWith(resolved("db/events/get.sql"), "utf-8");
    });

    it("does not read the file again on subsequent calls with the same path", async () => {
      mockReadFileSync.mockReturnValue("SELECT 1");
      mockQuery.mockResolvedValue({ rows: [] });

      await db.file("db/events/list.sql");
      await db.file("db/events/list.sql");
      await db.file("db/events/list.sql");

      expect(mockReadFileSync).toHaveBeenCalledOnce();
    });
  });

  describe("named param replacement", () => {
    it("replaces ${param} tokens with positional $N placeholders", async () => {
      mockReadFileSync.mockReturnValue("SELECT * FROM events WHERE id = ${id}");
      mockQuery.mockResolvedValue({ rows: [] });

      await db.file("db/events/get_by_id.sql", { id: "123" });

      const callArgs = mockQuery.mock.calls[0][0];
      expect(callArgs.text).toContain("$1");
      expect(callArgs.text).not.toContain("${id}");
    });

    it("assigns sequential numbers to distinct params", async () => {
      mockReadFileSync.mockReturnValue(
        "SELECT * FROM events WHERE user_id = ${user_id} AND sport_type = ${sport}"
      );
      mockQuery.mockResolvedValue({ rows: [] });

      const user_id = "123";
      const sport = "Soccer";
      await db.file("db/events/get_by_user_id_and_sport.sql", {user_id, sport});

      const callArgs = mockQuery.mock.calls[0][0];
      expect(callArgs.text).toContain("$1");
      expect(callArgs.text).toContain("$2");
      expect(callArgs.text).not.toContain("${user_id}");
      expect(callArgs.text).not.toContain("${sport}");
      // Ensure the named params are mapped to the correct values
      expect(callArgs.values).toEqual([user_id, sport]);
    });

    it("reuses the same $N for a repeated param name", async () => {
      mockReadFileSync.mockReturnValue(
        "SELECT * FROM events WHERE id = ${id} OR parent_id = ${id}"
      );
      mockQuery.mockResolvedValue({ rows: [] });

      await db.file("db/events/get_by_id_or_parent.sql", { id: "123" });

      const callArgs = mockQuery.mock.calls[0][0];
      // Both occurrences should resolve to $1, not $1 and $2
      const matches = callArgs.text.match(/\$\d/g);
      expect(matches).toEqual(["$1", "$1"]);
    });

    it("prepends the original path argument as a SQL comment", async () => {
      mockReadFileSync.mockReturnValue("SELECT 1");
      mockQuery.mockResolvedValue({ rows: [] });

      await db.file("db/events/get_by_id.sql");

      const callArgs = mockQuery.mock.calls[0][0];
      expect(callArgs.text).toMatch(/^-- db\/events\/get_by_id\.sql/);
    });
  });

  describe("error handling", () => {
    it("throws when readFileSync fails", async () => {
      mockReadFileSync.mockImplementation(() => {
        throw new Error("File not found");
      });

      await expect(db.file("db/events/missing.sql")).rejects.toThrow("File not found");
    });

    it("throws when pool.query rejects", async () => {
      mockReadFileSync.mockReturnValue("SELECT 1");
      const queryError = Object.assign(new Error("syntax error"), {
        position: "9",
        code: "42601",
      });
      mockQuery.mockRejectedValue(queryError);

      await expect(db.file("db/events/bad_query.sql")).rejects.toThrow("syntax error");
    });

    it("attaches the original path argument to query error cause metadata", async () => {
      mockReadFileSync.mockReturnValue("SELECT 1");
      const queryError = Object.assign(new Error("query failed"), {
        position: "0",
        code: "42P01",
      });
      mockQuery.mockRejectedValue(queryError);

      try {
        await db.file("db/events/error_meta.sql", { foo: "bar" });
      } catch (e: unknown) {
        const err = e as { cause: { path: string; code: string } };
        expect(err.cause.path).toBe("db/events/error_meta.sql");
        expect(err.cause.code).toBe("42P01");
      }
    });
  });
});
