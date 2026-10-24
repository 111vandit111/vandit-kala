import { beforeEach, describe, expect, it, vi } from "vitest";

const { findOneAndUpdate } = vi.hoisted(() => ({ findOneAndUpdate: vi.fn() }));

vi.mock("../db", () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }));
vi.mock("../models/DailyVisit", () => ({ default: { findOneAndUpdate, find: vi.fn() } }));

import { buildSeries, clampDays, recordVisit, utcDayKey } from "../analyticsService";
import { ANALYTICS_MAX_DAYS } from "../limits";

describe("utcDayKey", () => {
  it("uses the UTC date at the day boundary", () => {
    expect(utcDayKey(new Date("2026-03-01T23:59:59.999Z"))).toBe("2026-03-01");
    expect(utcDayKey(new Date("2026-03-02T00:00:00.000Z"))).toBe("2026-03-02");
  });
});

describe("buildSeries", () => {
  const now = new Date("2026-03-10T12:00:00Z");

  it("zero-fills every day and totals per type", () => {
    const series = buildSeries(3, now, [
      { type: "recruiter", day: "2026-03-10", count: 2 },
      { type: "stalker", day: "2026-03-08", count: 1 },
      { type: "personal", day: "2026-01-01", count: 9 },
    ]);
    expect(series.rows.map((row) => row.day)).toEqual(["2026-03-08", "2026-03-09", "2026-03-10"]);
    expect(series.rows[1].total).toBe(0);
    expect(series.totals).toEqual({ recruiter: 2, personal: 0, stalker: 1, total: 3 });
    expect(series.from).toBe("2026-03-08");
    expect(series.to).toBe("2026-03-10");
  });
});

describe("clampDays", () => {
  it("defaults, and clamps to 1..max", () => {
    expect(clampDays(null)).toBe(30);
    expect(clampDays("abc")).toBe(30);
    expect(clampDays("0")).toBe(1);
    expect(clampDays("99999")).toBe(ANALYTICS_MAX_DAYS);
  });
});

describe("recordVisit", () => {
  beforeEach(() => {
    findOneAndUpdate.mockReset();
  });

  it("increments the daily counter with upsert", async () => {
    await recordVisit("recruiter", new Date("2026-03-10T00:00:00Z"));
    expect(findOneAndUpdate).toHaveBeenCalledWith(
      { type: "recruiter", day: "2026-03-10" },
      { $inc: { count: 1 } },
      { upsert: true }
    );
  });
});
