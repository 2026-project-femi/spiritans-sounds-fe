import { Media, User } from "@/payload-types";

export interface SEO {
	metaTitle?: string;
	metaDescription?: string;
	ogImage?: {
		asset: {
			url: string;
		};
	};
}

export interface Page {
	title: string;
	content: any; // Using 'any' for Sanity's portable text for now
	image?: {
		asset: {
			url: string;
		};
	};
	seo?: SEO;
}

export interface SidebarRecentPost {
	_id: string;
	slug: string;
	title: string;
	publishedAt: string;
	imageUrl?: string;
	type: "homily" | "article"; // To differentiate between homily and articles
}

export interface SidebarProps {
	categories: string[]; // List of categories (strings)
	recentPosts: SidebarRecentPost[]; // List of recent posts (homily/articles)
}

export interface BasicItem {
	_id: string;
	title: string;
	slug: string;
	imageUrl?: string;
	excerpt?: string;
}

export interface HomilyItem extends BasicItem {
	date: string;
	scripture?: string;
	category?: string;
}


export interface Comment {
  _id: string
  name: string
  email: string
  comment: string
  createdAt: string
}

export interface Homily extends HomilyItem {
	audio?: string;
	youtubeUrl?: string;
	content: any; // Sanity Portable Text
	publishedAt?: string;
	seo?: SEO;
	comments?: Comment[];
}

export interface PrayerItem extends BasicItem {
	category?: string;
}

export interface Prayer extends PrayerItem {
	content: any; // Sanity Portable Text
	comments?: Comment[];
}

export interface MusicItem extends BasicItem {
	artist?: string;
	audioUrl?: string;
	lyrics?: string;
}

export interface Music extends MusicItem {
	content: any; // Assuming content field for full lyrics/details
	comments?: Comment[];
}

export interface ArticleItem extends BasicItem {
	author?: string;
	publishedAt?: string;
}

export interface Article extends ArticleItem {
	youtubeUrl?: string;
	content: any;
	seo?: SEO;
	comments?: Comment[];
}

export interface EventItem extends BasicItem {
	date: string;
	location?: string;
	description?: string;
	body?: any; // Sanity Portable Text
	youtubeUrl?: string;
}

export interface Radio {
	streamUrl?: string;
	schedule?: string;
	currentProgram?: string;
}

export interface Publication {
	title?: string;
	description?: string;
	price?: number;
	cover?: {
		asset: {
			url: string;
		};
	};
	file?: {
		asset: {
			url: string;
		};
	};
}

export interface DonationPage {
	message?: string;
	bankDetails?: string;
	paymentLink?: string;
}

export interface Newsletter {
	headline?: string;
	description?: string;
}

export interface ContactPage {
	address?: string;
	email?: string;
	phone?: string;
	socialLinks?: {
		platform: string;
		url: string;
	}[];
}

export interface LatestPostItem {
	_id: string;
	title: string;
	slug: string;
	date: string;
	scripture?: string;
	category?: string;
	author?: string;
	imageUrl?: string;
	excerpt?: string;
	type: "homily" | "article";
	publishedAt?: string;
}

export interface HomeData {
	title: string;
	heroText: string;
	carouselImages?: string[];
	ctaSection: {
		buttonText: string;
		buttonLink: string;
	};
	seo?: SEO;
	latestPosts: LatestPostItem[];
	latestHomilies: HomilyItem[];
	latestPrayers: PrayerItem[];
	latestMusic: MusicItem[];
}

export type PostType = 'homily' | 'article' | 'prayer'

export interface ScheduleItem {
  time: string;
  endTime?: string; // When the broadcast ends — no playback outside this range
  program: string;
  host?: string;
  type?: string;
  day?: string;
  audioUrl?: string; // Pre-recorded source
}

// export interface ContentBlock {
//   columns?:
//     | {
//         size?: ('oneThird' | 'half' | 'twoThirds' | 'full') | null;
//         richText?: {
//           root: {
//             type: string;
//             children: {
//               type: any;
//               version: number;
//               [k: string]: unknown;
//             }[];
//             direction: ('ltr' | 'rtl') | null;
//             format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
//             indent: number;
//             version: number;
//           };
//           [k: string]: unknown;
//         } | null;
//         enableLink?: boolean | null;
//         link?: {
//           type?: ('reference' | 'custom') | null;
//           newTab?: boolean | null;
//           reference?:
//             | ({
//                 relationTo: 'pages';
//                 value: number | Page;
//               } | null)
//             | ({
//                 relationTo: 'posts';
//                 value: number | Post;
//               } | null);
//           url?: string | null;
//           label: string;
//           /**
//            * Choose how the link should be rendered.
//            */
//           appearance?: ('default' | 'outline') | null;
//         };
//         id?: string | null;
//       }[]
//     | null;
//   id?: string | null;
//   blockName?: string | null;
//   blockType: 'content';
// }
// export interface Post {
//   id: number;
//   title: string;
//   heroImage?: (number | null) | Media;
//   content: {
//     root: {
//       type: string;
//       children: {
//         type: any;
//         version: number;
//         [k: string]: unknown;
//       }[];
//       direction: ('ltr' | 'rtl') | null;
//       format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
//       indent: number;
//       version: number;
//     };
//     [k: string]: unknown;
//   };
//   relatedPosts?: (number | Post)[] | null;
//   categories?: (number | Category)[] | null;
//   meta?: {
//     title?: string | null;
//     /**
//      * Maximum upload file size: 12MB. Recommended file size for images is <500KB.
//      */
//     image?: (number | null) | Media;
//     description?: string | null;
//   };
//   publishedAt?: string | null;
//   authors?: (number | User)[] | null;
//   populatedAuthors?:
//     | {
//         id?: string | null;
//         name?: string | null;
//       }[]
//     | null;
//   /**
//    * When enabled, the slug will auto-generate from the title field on save and autosave.
//    */
//   generateSlug?: boolean | null;
//   slug: string;
//   updatedAt: string;
//   createdAt: string;
//   _status?: ('draft' | 'published') | null;
// }
// export interface Category {
//   id: number;
//   title: string;
//   /**
//    * When enabled, the slug will auto-generate from the title field on save and autosave.
//    */
//   generateSlug?: boolean | null;
//   slug: string;
//   parent?: (number | null) | Category;
//   breadcrumbs?:
//     | {
//         doc?: (number | null) | Category;
//         url?: string | null;
//         label?: string | null;
//         id?: string | null;
//       }[]
//     | null;
//   updatedAt: string;
//   createdAt: string;
// }
// export interface Form {
//   id: number;
//   title: string;
//   fields?:
//     | (
//         | {
//             name: string;
//             label?: string | null;
//             width?: number | null;
//             required?: boolean | null;
//             defaultValue?: boolean | null;
//             id?: string | null;
//             blockName?: string | null;
//             blockType: 'checkbox';
//           }
//         | {
//             name: string;
//             label?: string | null;
//             width?: number | null;
//             required?: boolean | null;
//             id?: string | null;
//             blockName?: string | null;
//             blockType: 'country';
//           }
//         | {
//             name: string;
//             label?: string | null;
//             width?: number | null;
//             required?: boolean | null;
//             id?: string | null;
//             blockName?: string | null;
//             blockType: 'email';
//           }
//         | {
//             message?: {
//               root: {
//                 type: string;
//                 children: {
//                   type: any;
//                   version: number;
//                   [k: string]: unknown;
//                 }[];
//                 direction: ('ltr' | 'rtl') | null;
//                 format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
//                 indent: number;
//                 version: number;
//               };
//               [k: string]: unknown;
//             } | null;
//             id?: string | null;
//             blockName?: string | null;
//             blockType: 'message';
//           }
//         | {
//             name: string;
//             label?: string | null;
//             width?: number | null;
//             defaultValue?: number | null;
//             required?: boolean | null;
//             id?: string | null;
//             blockName?: string | null;
//             blockType: 'number';
//           }
//         | {
//             name: string;
//             label?: string | null;
//             width?: number | null;
//             defaultValue?: string | null;
//             placeholder?: string | null;
//             options?:
//               | {
//                   label: string;
//                   value: string;
//                   id?: string | null;
//                 }[]
//               | null;
//             required?: boolean | null;
//             id?: string | null;
//             blockName?: string | null;
//             blockType: 'select';
//           }
//         | {
//             name: string;
//             label?: string | null;
//             width?: number | null;
//             required?: boolean | null;
//             id?: string | null;
//             blockName?: string | null;
//             blockType: 'state';
//           }
//         | {
//             name: string;
//             label?: string | null;
//             width?: number | null;
//             defaultValue?: string | null;
//             required?: boolean | null;
//             id?: string | null;
//             blockName?: string | null;
//             blockType: 'text';
//           }
//         | {
//             name: string;
//             label?: string | null;
//             width?: number | null;
//             defaultValue?: string | null;
//             required?: boolean | null;
//             id?: string | null;
//             blockName?: string | null;
//             blockType: 'textarea';
//           }
//       )[]
//     | null;
//   submitButtonLabel?: string | null;
//   /**
//    * Choose whether to display an on-page message or redirect to a different page after they submit the form.
//    */
//   confirmationType?: ('message' | 'redirect') | null;
//   confirmationMessage?: {
//     root: {
//       type: string;
//       children: {
//         type: any;
//         version: number;
//         [k: string]: unknown;
//       }[];
//       direction: ('ltr' | 'rtl') | null;
//       format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
//       indent: number;
//       version: number;
//     };
//     [k: string]: unknown;
//   } | null;
//   redirect?: {
//     url: string;
//   };
//   /**
//    * Send custom emails when the form submits. Use comma separated lists to send the same email to multiple recipients. To reference a value from this form, wrap that field's name with double curly brackets, i.e. {{firstName}}. You can use a wildcard {{*}} to output all data and {{*:table}} to format it as an HTML table in the email.
//    */
//   emails?:
//     | {
//         emailTo?: string | null;
//         cc?: string | null;
//         bcc?: string | null;
//         replyTo?: string | null;
//         emailFrom?: string | null;
//         subject: string;
//         /**
//          * Enter the message that should be sent in this email.
//          */
//         message?: {
//           root: {
//             type: string;
//             children: {
//               type: any;
//               version: number;
//               [k: string]: unknown;
//             }[];
//             direction: ('ltr' | 'rtl') | null;
//             format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
//             indent: number;
//             version: number;
//           };
//           [k: string]: unknown;
//         } | null;
//         id?: string | null;
//       }[]
//     | null;
//   updatedAt: string;
//   createdAt: string;
// }