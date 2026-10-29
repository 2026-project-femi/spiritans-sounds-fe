import type { LatestPost } from "../types";
import { DemoBadge, SectionHeading } from "./primitives";
import { UpdateCard } from "./UpdateCard";

export function LatestCreators({ posts }: { posts: LatestPost[] }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Latest from our creators"
          title="New work, new milestones."
          tone="teal"
          intro="Fresh releases, performances, exhibitions and moments from the collective."
        />
        <DemoBadge />
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <UpdateCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
