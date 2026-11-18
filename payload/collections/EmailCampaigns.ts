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
import { FixedToolbarFeature, HeadingFeature, InlineToolbarFeature, lexicalEditor } from "@payloadcms/richtext-lexical";

export const EmailCampaigns: CollectionConfig = {
	slug: "emailCampaigns",
	admin: {
		useAsTitle: "subject",
		defaultColumns: ["subject", "audience", "status", "sentAt", "sentCount", "failedCount"],
		hidden: ({ user }) => user?.role !== 'admin',
		// Inject the Send Campaign button next to Payload's own Save button.
		// Do NOT use `SaveButton` here: replacing it removes the only way to save
		// a new campaign (and the send handler has no document id yet).
		components: {
			edit: {
				beforeDocumentControls: [
					"@/components/admin/SendCampaignButton#SendCampaignButton",
				],
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
					FixedToolbarFeature(),
					InlineToolbarFeature(),
				],
			}),
		},

		// ── Audience ─────────────────────────────────────────────────────────────
		{
			name: "audience",
			type: "select",
			label: "Audience",
			required: true,
			defaultValue: "subscribers",
			options: [
				{ label: "Newsletter Subscribers", value: "subscribers" },
				{ label: "Book Launch Registrations", value: "book-launch" },
				{
					label: "Book Launch Registrations (not yet reminded)",
					value: "book-launch-unreminded",
				},
				{
					label: "Newsletter Subscribers + Book Launch Registrations",
					value: "all",
				},
			],
			admin: {
				position: "sidebar",
				description:
					"Who receives this campaign. Book launch greetings use the registration's full name.",
			},
		},
		{
			name: "markReminderSent",
			type: "checkbox",
			label: "Mark registrations as reminded",
			defaultValue: false,
			admin: {
				position: "sidebar",
				condition: (data) =>
					data?.audience === "book-launch" ||
					data?.audience === "book-launch-unreminded" ||
					data?.audience === "all",
				description:
					"Sets “Reminder Email Sent” on book launch registrations that receive this campaign.",
			},
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
				{ label: "Partially sent (retry failed)", value: "partial" },
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
				description: "Total recipients for the selected audience at time of send.",
			},
		},
		{
			name: "sentCount",
			type: "number",
			label: "Sent So Far",
			defaultValue: 0,
			admin: {
				position: "sidebar",
				readOnly: true,
				description: "Successful deliveries so far.",
			},
		},
		{
			name: "failedCount",
			type: "number",
			label: "Failed",
			defaultValue: 0,
			admin: {
				position: "sidebar",
				readOnly: true,
				description: "Recipients whose last send failed. They are retried on resume.",
			},
		},
		{
			name: "attemptedCount",
			type: "number",
			label: "Attempted",
			defaultValue: 0,
			admin: {
				position: "sidebar",
				readOnly: true,
				description: "Offset into the subscriber list. Used to resume without re-sending.",
			},
		},
		{
			name: "failedEmails",
			type: "json",
			label: "Failed Recipients",
			admin: {
				readOnly: true,
				hidden: true,
				description: "Retried first on the next send/resume. Managed by the send API.",
			},
		},
	],
};
