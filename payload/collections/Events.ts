import { Banner } from "@/blocks/Banner/config";
import { Code } from "@/blocks/Code/config";
import { MediaBlock } from "@/blocks/MediaBlock/config";
import {
	BlocksFeature,
	FixedToolbarFeature,
	HeadingFeature,
	HorizontalRuleFeature,
	InlineToolbarFeature,
	lexicalEditor,
	UploadFeature,
} from "@payloadcms/richtext-lexical";
import { revalidatePath } from "next/cache";
import { CollectionConfig } from "payload";

export const Events: CollectionConfig = {
	slug: "events",
	admin: {
		useAsTitle: "title",
		hidden: ({user})=>user.role === 'contributor'
	},
	access: {
		read: () => true,	
	},
	hooks: {
		afterChange: [({doc})=>{
			revalidatePath('/unveiler');``
			return doc;
		}]
	},
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
		},
		{
			name: "slug",
			type: "text",
			unique: true,
			required: true,
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "eventType",
			type: "select",
			options: [
				{ label: "Annual Celebration", value: "celebration" },
				{ label: "Workshop", value: "workshop" },
				{ label: "Retreat", value: "retreat" },
				{ label: "Concert / Performance", value: "concert" },
				{ label: "Symposium / Conference", value: "symposium" },
				{ label: "News", value: "news" },
				{ label: "Other", value: "other" },
			],
		},
		{
			name: "date",
			type: "date",
			required: true,
		},
		{
			name: "location",
			type: "text",
		},
		{
			name: "description",
			type: "textarea",
		},
		{
			name: "excerpt",
			type: "textarea",
		},
		{
			name: "youtubeUrl",
			type: "text",
			required: false,
		},
		{
			name: "body",
			type: "richText",
			editor: lexicalEditor({
				features: ({ rootFeatures }) => {
					return [
						...rootFeatures,
						UploadFeature({
							collections: {
								media: {
									fields: [
										{
											name: "linkUrl",
											type: "text",
											label: "Clickable Link URL (Optional)",
											admin: {
												placeholder: "https://... or /relative-path",
											},
										},
										{
											name: "openInNewTab",
											type: "checkbox",
											label: "Open link in new tab",
											defaultValue: false,
										},
									],
								},
							},
						}),
						HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }),
						BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
						FixedToolbarFeature(),
						InlineToolbarFeature(),
						HorizontalRuleFeature(),
					];
				},
			}),
			label: "Content text",
		},
		{
			name: "isFeatured",
			type: "checkbox",
			defaultValue: false,
		},
		{
			name: "isPopular",
			type: "checkbox",
			defaultValue: false,
		},
		{
			name: "featuredImage",
			type: "upload",
			relationTo: "media",
		},
		{
			name: "publishedAt",
			type: "date",
		},
	],
};
