"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { Creator } from "../types";
import { filterCreators, type CreatorQuery } from "../lib/filter";
import { CreatorCard } from "./CreatorCard";
import { CreatorFilters } from "./CreatorFilters";

interface Props {
  creators: Creator[];
  classYears: number[];
  initial?: Partial<CreatorQuery>;
  /** Called when filters change — wire to URL search params if desired. */
  onQueryChange?: (q: Required<CreatorQuery>) => void;
}

export function CreatorDirectory({ creators, classYears, initial, onQueryChange }: Props) {
  const pathname = usePathname();
  const [q, setQ] = useState<Required<CreatorQuery>>({ search: "", category: "all", classYear: "all", ...initial });
  const results = useMemo(() => filterCreators(creators, q), [creators, q]);

  const update = (v: Required<CreatorQuery>) => {
    setQ(v);

    const params = new URLSearchParams();
    if (v.search.trim()) params.set("q", v.search.trim());
    if (v.category !== "all") params.set("talent", v.category);
    if (v.classYear !== "all") params.set("year", String(v.classYear));
    const query = params.toString();
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
    }

    onQueryChange?.(v);
  };

  return (
    <div>
      <CreatorFilters value={q} classYears={classYears} onChange={update} />
      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        Showing{" "}
        <strong key={results.length} className="yc-rise inline-block text-foreground">
          {results.length}
        </strong>{" "}
        of {creators.length} creators
      </p>
      {results.length ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((c) => <CreatorCard key={c.id} creator={c} />)}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-border p-14 text-center">
          <p className="font-display text-xl font-bold">No creators match those filters</p>
          <p className="mt-2 text-sm text-muted-foreground">Try a different talent or class year.</p>
        </div>
      )}
    </div>
  );
}
