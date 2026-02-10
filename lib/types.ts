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
	type: "homily" | "article"; // To differentiate between homilies and articles
}

export interface SidebarProps {
	categories: string[]; // List of categories (strings)
	recentPosts: SidebarRecentPost[]; // List of recent posts (homilies/articles)
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

export interface Homily extends HomilyItem {
	audio?: string;
	content: any; // Sanity Portable Text
	publishedAt?: string;
	seo?: SEO;
}

export interface PrayerItem extends BasicItem {
	category?: string;
}

export interface Prayer extends PrayerItem {
	content: any; // Sanity Portable Text
}

export interface MusicItem extends BasicItem {
	artist?: string;
	audioUrl?: string;
	lyrics?: string;
}

export interface Music extends MusicItem {
	content: any; // Assuming content field for full lyrics/details
}

export interface ArticleItem extends BasicItem {
	author?: string;
	publishedAt?: string;
}

export interface Article extends ArticleItem {
	content: any;
	seo?: SEO;
}

export interface EventItem extends BasicItem {
	date: string;
	location?: string;
	description?: string;
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
}
