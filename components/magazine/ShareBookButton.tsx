"use client";

import { ShareButtons } from "@/components/common/ShareButtons";

interface ShareBookButtonProps {
  title: string;
  slug: string;
}

export function ShareBookButton({ title, slug }: ShareBookButtonProps) {
  return (
    <ShareButtons
      title={title}
      slug={slug}
      itemType="book"
      theme="dark"
      basePath="/unveiler/books"
    />
  );
}

