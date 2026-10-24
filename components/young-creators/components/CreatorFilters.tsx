"use client";

import { Search, X } from "lucide-react";
import { CATEGORIES } from "../constants";
import type { CreatorQuery } from "../lib/filter";

interface Props {
  value: Required<CreatorQuery>;
  classYears: number[];
  onChange: (v: Required<CreatorQuery>) => void;
}

const chip = (active: boolean) =>
  `whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${active ? "border-ink bg-ink text-ink-foreground" : "border-border bg-card text-foreground hover:border-foreground/40"}`;

export function CreatorFilters({ value, classYears, onChange }: Props) {
  const set = (patch: Partial<CreatorQuery>) => onChange({ ...value, ...patch } as Required<CreatorQuery>);
  const dirty = value.search || value.category !== "all" || value.classYear !== "all";
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search" value={value.search} onChange={(e) => set({ search: e.target.value })}
            placeholder="Search by name, talent or city…" aria-label="Search creators"
            className="w-full rounded-full border border-input bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <select
          aria-label="Filter by class" value={String(value.classYear)}
          onChange={(e) => set({ classYear: e.target.value === "all" ? "all" : Number(e.target.value) })}
          className="rounded-full border border-input bg-card px-5 py-3 text-sm font-medium outline-none focus:border-primary"
        >
          <option value="all">All classes</option>
          {classYears.map((y) => <option key={y} value={y}>Class of {y}</option>)}
        </select>
        {dirty && (
          <button onClick={() => onChange({ search: "", category: "all", classYear: "all" })} className="inline-flex items-center gap-1 rounded-full px-4 py-3 text-sm text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" /> Clear
          </button>
        )}
      </div>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1" role="group" aria-label="Filter by talent">
        <button className={chip(value.category === "all")} onClick={() => set({ category: "all" })}>All talents</button>
        {CATEGORIES.map((c) => (
          <button key={c.value} className={chip(value.category === c.value)} onClick={() => set({ category: c.value })}>{c.label}</button>
        ))}
      </div>
    </div>
  );
}
