import type { TalentCategory } from "./types";

export const CATEGORIES: { value: TalentCategory; label: string }[] = [
  { value: "writing", label: "Writer" },
  { value: "music", label: "Musician" },
  { value: "visual-art", label: "Visual Artist" },
  { value: "photography", label: "Photographer" },
  { value: "dance", label: "Dancer" },
  { value: "digital", label: "Digital Creator" },
  { value: "technology", label: "Technology & Innovation" },
];

export const categoryLabel = (c: TalentCategory) =>
  CATEGORIES.find((x) => x.value === c)?.label ?? c;

export const JOURNEY = [
  { step: "Discover", text: "We find young talent in schools, parishes and communities." },
  { step: "Recognise", text: "Their gifts are celebrated publicly and formally." },
  { step: "Mentor", text: "Each creator is paired with an experienced mentor." },
  { step: "Develop", text: "Workshops, tools and training sharpen their craft." },
  { step: "Create", text: "They make new work with real support behind them." },
  { step: "Showcase", text: "We put their work in front of audiences." },
  { step: "Support", text: "Donors and partners fund the next step." },
  { step: "Impact", text: "Creators grow into leaders who lift others." },
] as const;

export const ORG = {
  parent: "Spiritans Sound Outreach",
  foundation: "Treasures Unveiler Youth Development Foundation",
  foundationShort: "TUYDEF",
  programme: "Young Creators Network",
  /** INTEGRATION: set `href` to the real TUYDEF contact page or mailto. null = not connected yet. */
  contact: { label: "Contact the Young Creators Team", href: null as string | null },
};
