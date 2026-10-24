export function TalentTags({ tags, size = "sm" }: { tags: string[]; size?: "sm" | "md" }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <li key={t} className={`rounded-full bg-accent font-medium text-accent-foreground ${size === "md" ? "px-3.5 py-1.5 text-sm" : "px-2.5 py-1 text-xs"}`}>{t}</li>
      ))}
    </ul>
  );
}
