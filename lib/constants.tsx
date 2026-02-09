import React from "react";
import { NavItem, Post } from "./types";

export const NAV_ITEMS: NavItem[] = [
	{ label: "Homilies", href: "#/homilies" },
	{ label: "Articles", href: "#/articles" },
	{ label: "Events", href: "#/events" },
	{
		label: "Resources",
		href: "#/resources",
		children: [
			{ label: "Prayers", href: "#/prayers" },
			{ label: "Music", href: "#/music" },
			{ label: "Gallery", href: "#/gallery" },
		],
	},
	{ label: "About", href: "#/about" },
];

export const DUMMY_POSTS: Post[] = [
	{
		id: "1",
		title: "The Silent Breath of the Divine",
		excerpt: "Exploring the contemplative traditions of the early desert fathers in a digital age.",
		category: "Article",
		date: "Oct 24, 2023",
		author: "Fr. Julian Spiritan",
		imageUrl: "https://picsum.photos/seed/sacred1/800/600",
	},
	{
		id: "2",
		title: "Sunday Homily: Grace in the Wilderness",
		excerpt: "Finding hope when the path forward seems obscured by the shadows of doubt.",
		category: "Homily",
		date: "Oct 22, 2023",
		author: "Bishop Marcus",
		imageUrl: "https://picsum.photos/seed/sacred2/800/600",
	},
	{
		id: "3",
		title: "A Liturgy of Light",
		excerpt: "Join us for a special evening of candlelit prayer and sacred Gregorian chant.",
		category: "Event",
		date: "Nov 01, 2023",
		author: "Worship Team",
		imageUrl: "https://picsum.photos/seed/sacred3/800/600",
	},
];

export const CATEGORIES = ["Homilies", "Spirituality", "Liturgical Music", "Community", "Theology"];
