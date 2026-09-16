import { revalidatePath } from "next/cache";
import { CollectionConfig } from "payload";

export const Comments: CollectionConfig = {
	slug: "comments",
	admin: {
		useAsTitle: "name",
		defaultColumns: ["name", "comment", "parent", "approved", "createdAt"],
		description: "Comments won't show on the site without approval. Replies to approved comments are published immediately.",
		hidden: ({user})=>user?.role === 'contributor' || user?.role === 'publishing_admin'
	},
	access: {
		read: () => true,
	},
	hooks: {
		afterChange: [({doc})=>{
		  revalidatePath('/articles');
		  revalidatePath('/homilies');
		  revalidatePath('/prayers');
		  revalidatePath('/unveiler/events');
		  return doc;
		}],
		afterDelete: [({doc})=>{
		  revalidatePath('/articles');
		  revalidatePath('/homilies');
		  revalidatePath('/prayers');
		  revalidatePath('/unveiler/events');
		  return doc;
		}]
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
		},
		{
			name: "email",
			type: "email",
			required: true,
		},
		{
			name: "comment",
			type: "textarea",
			required: true,
		},
		{
			name: "parent",
			type: "relationship",
			relationTo: "comments",
			admin: {
				description: "Parent comment if this is a reply",
			},
		},
		{
			name: "reactions",
			type: "json",
			defaultValue: {},
			admin: {
				description: "Counts of emoji reactions e.g. { '👍': 4, '❤️': 2 }",
			},
		},
		{
			name: "post",
			type: "relationship",
			relationTo: ["homily", "article", "prayer", "events"],
		},
		{
			name: "approved",
			type: "checkbox",
			defaultValue: false,
			admin: {
				description: "Comments won't show on the site without approval",
			},
		},
	],
};

