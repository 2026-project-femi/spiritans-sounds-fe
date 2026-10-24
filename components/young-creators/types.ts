/**
 * Young Creators Network — shared types.
 *
 * These map 1:1 to the proposed Payload CMS collections (see README.md):
 *   - `young-creators`      -> Creator
 *   - `ycn-mentor-applications`  -> MentorApplication
 *   - `ycn-opportunities`   -> OpportunityOffer
 *   - `ycn-support-intents` -> SupportIntent (handed to existing Paystack/Stripe flow)
 *
 * SAFEGUARDING: Creator deliberately has NO phone, email, address or DOB fields.
 * All contact goes through TUYDEF.
 */

export type TalentCategory =
  | "writing"
  | "music"
  | "visual-art"
  | "photography"
  | "dance"
  | "digital"
  | "technology";

export interface MediaItem {
  src: string;
  alt: string;
  caption?: string | undefined;
}

export interface CreativeWork {
  id: string;
  title: string;
  type: "Writing" | "Music" | "Artwork" | "Photo series" | "Performance" | "Video" | "Project";
  year: number;
  description: string;
  image?: MediaItem | undefined;
  /** External link (e.g. published piece, SoundCloud). Optional. */
  href?: string | undefined;
}

export interface Achievement {
  year: number;
  title: string;
  detail?: string | undefined;
}

export interface InterviewQA {
  question: string;
  answer: string;
}

export interface Creator {
  id: string;
  slug: string;
  /**
   * Name shown publicly. Set by a TUYDEF administrator according to consent
   * (full name with consent, first name + initial, or an agreed alias).
   */
  publicDisplayName: string;
  /** Records which naming basis the admin approved. Admin-only, not rendered. */
  nameVisibility?: "full-name" | "first-name-initial" | "alias" | undefined;
  isMinor: boolean;
  classYear: number; // e.g. 2025 -> "Class of 2025"
  primaryCategory: TalentCategory;
  talents: string[];
  /** Optional city/region — never an address. Omit to hide. */
  location?: string | undefined;
  tagline: string;
  portrait: MediaItem;
  bio: string[];
  giftsAndTalents: string;
  discoveryStory: string;
  interview: InterviewQA[];
  /** YouTube/Vimeo embed URL. Optional. */
  videoUrl?: string | undefined;
  videoPoster?: MediaItem | undefined;
  works: CreativeWork[];
  achievements: Achievement[];
  gallery: MediaItem[];
  featured?: boolean | undefined;
  /** Flag set while using placeholder content. */
  isDemo?: boolean | undefined;
}

export interface LatestPost {
  id: string;
  creatorSlug: string;
  title: string;
  kind: "New work" | "Performance" | "Milestone" | "Feature";
  date: string; // ISO
  excerpt: string;
  image: MediaItem;
}

export interface MentorApplication {
  fullName: string;
  email: string;
  phone?: string | undefined;
  organisation?: string | undefined;
  expertise: TalentCategory[];
  experience: string;
  availability: "monthly" | "fortnightly" | "weekly" | "project";
  format: "in-person" | "online" | "either";
  safeguardingConsent: boolean;
}

export interface OpportunityOffer {
  contactName: string;
  organisation: string;
  email: string;
  phone?: string | undefined;
  type: "internship" | "commission" | "performance" | "exhibition" | "scholarship" | "workshop" | "other";
  categories: TalentCategory[];
  title: string;
  description: string;
  location: string;
  deadline?: string | undefined;
  safeguardingConsent: boolean;
}

export type SupportFrequency = "one-off" | "monthly";
export type SupportCurrency = "NGN" | "GBP" | "USD";

export interface SupportIntent {
  amount: number;
  currency: SupportCurrency;
  frequency: SupportFrequency;
  designation: "general" | "mentorship" | "equipment" | "showcase";
  donorName: string;
  donorEmail: string;
  giftAid?: boolean | undefined;
}

/** Optional headline figure. Leave the list empty until real data exists. */
export interface ImpactStat {
  value: string;
  label: string;
}
