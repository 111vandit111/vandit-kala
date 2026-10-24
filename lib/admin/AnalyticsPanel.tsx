"use client";

import React, { useCallback, useEffect, useState } from "react";
import Button from "../Button";
import { adminFetch, AdminApiError } from "./adminFetch";

interface SeriesRow {
  day: string;
  recruiter: number;
  personal: number;
  stalker: number;
  total: number;
}

interface Series {
  rows: SeriesRow[];
  totals: { recruiter: number; personal: number; stalker: number; total: number };
}

type ProfileKey = "recruiter" | "personal" | "stalker";

const DAY_RANGES = [7, 30, 90];
const DEFAULT_DAYS = 30;
const PROFILES: { key: ProfileKey; label: string; barClass: string }[] = [
  { key: "recruiter", label: "Recruiter", barClass: "bg-prime" },
  { key: "personal", label: "Friends & Family", barClass: "bg-alert-success" },
  { key: "stalker", label: "Random", barClass: "bg-primary-500" },
];
const PERCENT = 100;

const AnalyticsSkeleton = () => (
  <div role="status" aria-label="Loading analytics" className="animate-pulse space-y-4">
    <div className="grid grid-cols-4 gap-4 md:grid-cols-2 sm:grid-cols-1">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="h-24 rounded-xl bg-white/10" />
      ))}
    </div>
    <div className="h-64 rounded-xl bg-white/10" />
  </div>
);

const TotalsCards = ({ totals }: { totals: Series["totals"] }) => (
  <div className="grid grid-cols-4 gap-4 md:grid-cols-2 sm:grid-cols-1">
    {PROFILES.map((profile) => (
      <div key={profile.key} className="rounded-xl bg-white/5 p-4">
        <p className="flex items-center gap-2 text-sm text-secondary-400">
          <span aria-hidden="true" className={`h-3 w-3 rounded-sm ${profile.barClass}`} />
          {profile.label}
        </p>
        <p className="mt-1 text-3xl font-bold">{totals[profile.key]}</p>
      </div>
    ))}
    <div className="rounded-xl bg-white/5 p-4">
      <p className="text-sm text-secondary-400">All visits</p>
      <p className="mt-1 text-3xl font-bold">{totals.total}</p>
    </div>
  </div>
);

const StackedBars = ({ rows }: { rows: SeriesRow[] }) => {
  const maxTotal = Math.max(1, ...rows.map((row) => row.total));
  return (
    <div className="rounded-xl bg-white/5 p-4">
      <div
        role="img"
        aria-label="Daily visits by profile. A table with the same data follows."
        className="flex h-56 items-end gap-px"
      >
        {rows.map((row) => (
          <div
            key={row.day}
            title={`${row.day}: ${row.total} visits`}
            className="flex h-full min-w-0 flex-1 flex-col-reverse"
          >
            {PROFILES.map((profile) => (
              <div
                key={profile.key}
                className={profile.barClass}
                style={{ height: `${(row[profile.key] / maxTotal) * PERCENT}%` }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-secondary-400">
        <span>{rows[0]?.day}</span>
        <span>{rows[rows.length - 1]?.day}</span>
      </div>
    </div>
  );
};

const VisitsTable = ({ rows }: { rows: SeriesRow[] }) => (
  <details className="rounded-xl bg-white/5 p-4">
    <summary className="min-h-11 cursor-pointer py-2 font-semibold focus-visible:ring-2 focus-visible:ring-prime outline-none">
      View data as a table
    </summary>
    <div className="mt-2 max-h-80 overflow-y-auto">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Visits per day by profile</caption>
        <thead className="sticky top-0 bg-prime-navyLight">
          <tr>
            <th scope="col" className="p-2">Day</th>
            <th scope="col" className="p-2">Recr.</th>
            <th scope="col" className="p-2">F&amp;F</th>
            <th scope="col" className="p-2">Rand.</th>
            <th scope="col" className="p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {[...rows].reverse().map((row) => (
            <tr key={row.day} className="border-t border-white/10">
              <th scope="row" className="p-2 font-normal">{row.day}</th>
              <td className="p-2">{row.recruiter}</td>
              <td className="p-2">{row.personal}</td>
              <td className="p-2">{row.stalker}</td>
              <td className="p-2 font-semibold">{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </details>
);

const AnalyticsPanel = () => {
  const [days, setDays] = useState(DEFAULT_DAYS);
  const [series, setSeries] = useState<Series | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async (range: number) => {
    setIsLoading(true);
    setError("");
    try {
      const body = await adminFetch<{ data: Series }>(`/api/admin/analytics?days=${range}`);
      setSeries(body.data);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not load analytics.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(days);
  }, [days, load]);

  const hasVisits = (series?.totals.total ?? 0) > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div>
          <label htmlFor="analytics-days" className="mr-2 text-sm text-secondary-400">Range</label>
          <select
            id="analytics-days"
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="min-h-11 rounded-lg border border-default-gray bg-prime-navy px-3 focus-visible:ring-2 focus-visible:ring-prime outline-none"
          >
            {DAY_RANGES.map((range) => (
              <option key={range} value={range}>Last {range} days</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <AnalyticsSkeleton />}

      {!isLoading && error && (
        <div role="alert" className="rounded-xl bg-white/5 p-6">
          <p className="text-sm text-alert-error">{error}</p>
          <Button variant="prime" className="mt-4 min-h-11 px-4" onClick={() => load(days)}>Retry</Button>
        </div>
      )}

      {!isLoading && !error && series && (
        hasVisits ? (
          <>
            <TotalsCards totals={series.totals} />
            <StackedBars rows={series.rows} />
            <VisitsTable rows={series.rows} />
          </>
        ) : (
          <p className="rounded-xl bg-white/5 p-8 text-center text-secondary-400">No visits yet</p>
        )
      )}
    </div>
  );
};

export default AnalyticsPanel;
