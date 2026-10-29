export function TalentTags({ tags, size = "sm" }: { tags: string[]; size?: "sm" | "md" }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <li
          key={t}
          className={`inline-flex items-center gap-1.5 rounded-lg border border-accent-foreground/10 bg-accent font-semibold text-accent-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.35)] ${
            size === "md" ? "px-3.5 py-1.5 text-sm" : "px-2.5 py-1 text-xs"
          }`}
        >
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-foreground/45" />
          {t}
        </li>
      ))}
    </ul>
  );
}
