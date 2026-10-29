"use client";

import { Search, X } from "lucide-react";
import { CATEGORIES } from "../constants";
import type { TalentCategory } from "../types";
import type { CreatorQuery } from "../lib/filter";

interface Props {
  value: Required<CreatorQuery>;
  classYears: number[];
  onChange: (v: Required<CreatorQuery>) => void;
}

const DOT: Record<TalentCategory, string> = {
  writing: "bg-primary",
  music: "bg-lilac",
  "visual-art": "bg-cobalt",
  photography: "bg-teal",
  dance: "bg-primary",
  digital: "bg-cobalt",
  technology: "bg-teal",
};

const chip = (active: boolean) =>
  `inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
    active
      ? "border-ink bg-ink text-ink-foreground shadow-[0_8px_20px_-12px_var(--yc-ink)]"
      : "border-border bg-background text-foreground hover:-translate-y-0.5 hover:border-foreground/40"
  }`;

export function CreatorFilters({ value, classYears, onChange }: Props) {
  const set = (patch: Partial<CreatorQuery>) => onChange({ ...value, ...patch } as Required<CreatorQuery>);
  const dirty = value.search || value.category !== "all" || value.classYear !== "all";

  return (
    <div className="rounded-3xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur md:p-5">
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={value.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Search by name, talent or city…"
            aria-label="Search creators"
            className="w-full rounded-full border border-input bg-background py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <select
          aria-label="Filter by class"
          value={String(value.classYear)}
          onChange={(e) => set({ classYear: e.target.value === "all" ? "all" : Number(e.target.value) })}
          className="rounded-full border border-input bg-background px-5 py-3 text-sm font-medium outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All classes</option>
          {classYears.map((y) => (
            <option key={y} value={y}>Class of {y}</option>
          ))}
        </select>
        {dirty && (
          <button
            type="button"
            onClick={() => onChange({ search: "", category: "all", classYear: "all" })}
            className="inline-flex items-center justify-center gap-1 rounded-full border border-border bg-background px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            <X className="h-4 w-4" /> Clear all
          </button>
        )}
      </div>

      <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter by talent">
        <button
          type="button"
          aria-pressed={value.category === "all"}
          onClick={() => set({ category: "all" })}
          className={chip(value.category === "all")}
        >
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
          All talents
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            aria-pressed={value.category === c.value}
            onClick={() => set({ category: c.value })}
            className={chip(value.category === c.value)}
          >
            <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${DOT[c.value]}`} />
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
