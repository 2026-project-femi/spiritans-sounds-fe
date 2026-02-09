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