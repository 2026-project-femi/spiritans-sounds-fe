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
import { authenticated } from "@/access/authenticated";
import { authenticatedOrPublished } from "@/access/authenticatedOrPublished";
import { publishedAtField } from "@/payload/fields/statusField";
import { revalidatePath } from "next/cache";
import { CollectionConfig } from "payload";

export const Events: CollectionConfig = {
	slug: "events",
	admin: {
		useAsTitle: "title",
		hidden: ({user})=>user.role === 'contributor',
		defaultColumns: ['title', '_status', 'date', 'publishedAt', 'updatedAt'],
	},
	access: {
		read: authenticatedOrPublished,
		readVersions: authenticated,
		create: authenticated,
		update: authenticated,
		delete: authenticated,
	},
	hooks: {
		afterChange: [({doc})=>{
			revalidatePath('/unveiler');
			return doc;
		}],
		afterDelete: [({doc})=>{
			revalidatePath('/unveiler');
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
	hooks: {
      		  beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            const title = data?.title ?? ''
            return title
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^\w-]/g, '')
              .slice(0, 96)
          },
        ],
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
		publishedAtField,
	],
	versions: {
		drafts: {
			autosave: false,
			schedulePublish: true,
		},
		maxPerDoc: 25,
	},
};
