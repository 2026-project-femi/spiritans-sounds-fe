// import { CollectionConfig } from 'payload'

// export const EmailCampaigns: CollectionConfig = {
//   slug: 'emailCampaigns',
//   admin: {
//     useAsTitle: 'subject',
//   },
//   fields: [
//     {
//       name: 'subject',
//       type: 'text',
//       required: true,
//     },
//     {
//       name: 'body',
//       type: 'richText',
//       required: true,
//     },
//     {
//       name: 'status',
//       type: 'select',
//       options: [
//         { label: 'Draft', value: 'draft' },
//         { label: 'Sent', value: 'sent' },
//       ],
//       defaultValue: 'draft',
//     },
//     {
//       name: 'sentAt',
//       type: 'date',
//       admin: {
//         readOnly: true,
//       },
//     },
//   ],
// }

// collections/EmailCampaigns.ts
import type { CollectionConfig } from "payload";
import { BlocksFeature, FixedToolbarFeature, HeadingFeature, InlineToolbarFeature, lexicalEditor } from "@payloadcms/richtext-lexical";

export const EmailCampaigns: CollectionConfig = {
	slug: "emailCampaigns",
	admin: {
		useAsTitle: "subject",
		defaultColumns: ["subject", "status", "sentAt", "sentCount"],
		// Inject the Send Campaign button into the document toolbar
		components: {
			edit: {
				// Rendered in the document sidebar
				SaveButton: "@/components/admin/SendCampaignButton#SendCampaignButton",
			},
		},
		description: "Create and send email campaigns to all active subscribers.",
	},
	access: {
		read: ({ req }) => req.user?.role === "admin",
		create: ({ req }) => req.user?.role === "admin",
		update: ({ req }) => req.user?.role === "admin",
		delete: ({ req }) => req.user?.role === "admin",
	},
	fields: [
		// ── Authoring ────────────────────────────────────────────────────────────
		{
			name: "subject",
			type: "text",
			label: "Subject Line",
			required: true,
		},
		{
			name: "preheader",
			type: "text",
			label: "Preview Text",
			admin: {
				description: "Shown in the inbox preview before the email is opened (50–90 chars).",
			},
		},
		{
			name: "body",
			type: "richText",
			label: "Email Body",
			editor: lexicalEditor({
				features: ({ rootFeatures }) => [
					...rootFeatures,
					HeadingFeature({ enabledHeadingSizes: ["h2", "h3"] }),
					BlocksFeature({ blocks: [] }),
					FixedToolbarFeature(),
					InlineToolbarFeature(),
				],
			}),
		},

		// ── Status (read-only — updated by the send API) ──────────────────────────
		{
			name: "status",
			type: "select",
			label: "Status",
			defaultValue: "draft",
			options: [
				{ label: "Draft", value: "draft" },
				{ label: "Paused (rate limit)", value: "paused" },
				{ label: "Sent", value: "sent" },
			],
			admin: {
				position: "sidebar",
				readOnly: true,
			},
		},
		{
			name: "sentAt",
			type: "date",
			label: "Sent At",
			admin: {
				position: "sidebar",
				readOnly: true,
				date: { displayFormat: "d MMM yyyy, h:mm a" },
			},
		},
		{
			name: "recipientCount",
			type: "number",
			label: "Recipients",
			admin: {
				position: "sidebar",
				readOnly: true,
				description: "Total subscribers at time of send.",
			},
		},
		{
			name: "sentCount",
			type: "number",
			label: "Sent So Far",
			admin: {
				position: "sidebar",
				readOnly: true,
				description: "Used as the resume offset if rate-limited.",
			},
		},
	],
};
