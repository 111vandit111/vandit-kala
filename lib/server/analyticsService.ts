import DailyVisit from "./models/DailyVisit";
import { ANALYTICS_MAX_DAYS, TRACKED_PROFILE_TYPES, type ProfileType } from "./limits";
import { connectDb } from "./db";

const MS_PER_DAY = 86_400_000;
const DAY_KEY_LENGTH = 10;
const DEFAULT_DAYS = 30;

export type SeriesRow = Record<ProfileType, number> & { day: string; total: number };
export type SeriesTotals = Record<ProfileType, number> & { total: number };
export type Series = { from: string; to: string; rows: SeriesRow[]; totals: SeriesTotals };

export function clampDays(raw: string | null): number {
  const value = Number.parseInt(raw ?? "", 10);
  if (!Number.isFinite(value)) return DEFAULT_DAYS;
  return Math.min(Math.max(value, 1), ANALYTICS_MAX_DAYS);
}

export function utcDayKey(now: Date | number = new Date()): string {
  return new Date(now).toISOString().slice(0, DAY_KEY_LENGTH);
}

export async function recordVisit(type: ProfileType, now: Date | number = new Date()): Promise<void> {
  await connectDb();
  await DailyVisit.findOneAndUpdate(
    { type, day: utcDayKey(now) },
    { $inc: { count: 1 } },
    { upsert: true }
  );
}

function emptyRow(day: string): SeriesRow {
  return { day, recruiter: 0, personal: 0, stalker: 0, total: 0 };
}

export function buildSeries(
  days: number,
  now: Date | number,
  counts: { type: ProfileType; day: string; count: number }[]
): Series {
  const todayMs = Date.parse(utcDayKey(now));
  const rows: SeriesRow[] = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    rows.push(emptyRow(utcDayKey(todayMs - offset * MS_PER_DAY)));
  }
  const byDay = new Map(rows.map((row) => [row.day, row]));
  const totals: SeriesTotals = { recruiter: 0, personal: 0, stalker: 0, total: 0 };
  for (const entry of counts) {
    const row = byDay.get(entry.day);
    if (!row || !TRACKED_PROFILE_TYPES.includes(entry.type)) continue;
    row[entry.type] += entry.count;
    row.total += entry.count;
    totals[entry.type] += entry.count;
    totals.total += entry.count;
  }
  return { from: rows[0].day, to: rows[rows.length - 1].day, rows, totals };
}

export async function getSeries(days: number, now: Date | number = new Date()): Promise<Series> {
  await connectDb();
  const todayMs = Date.parse(utcDayKey(now));
  const from = utcDayKey(todayMs - (days - 1) * MS_PER_DAY);
  const docs = await DailyVisit.find({ day: { $gte: from } }).lean();
  return buildSeries(
    days,
    now,
    docs.map((doc) => ({ type: doc.type as ProfileType, day: String(doc.day), count: Number(doc.count) }))
  );
}
