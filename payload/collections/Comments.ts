import { revalidatePath } from "next/cache";
import { CollectionConfig } from "payload";

export const Comments: CollectionConfig = {
	slug: "comments",
	admin: {
		useAsTitle: "name",
		defaultColumns: ["name", "comment", "approved", "createdAt"],
		description: "Comments won't show on the site without approval",
		hidden: ({user})=>user.role === 'contributor'
	},
	access: {
		read: () => true,
	},
	  hooks: {
		afterChange: [({doc})=>{
		  revalidatePath('/articles');
		  revalidatePath('/homilies');
		  revalidatePath('/prayers');
		  return doc;
		}],
		afterDelete: [({doc})=>{
		  revalidatePath('/articles');
		  revalidatePath('/homilies');
		  revalidatePath('/prayers');
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
			name: "post",
			type: "relationship",
			relationTo: ["homily", "article", "prayer"],
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
