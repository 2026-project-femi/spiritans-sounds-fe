import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'comment',
      title: 'Comment',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [{type: 'homily'}, {type: 'article'}, {type: 'prayer'}], 
    }),
    defineField({
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      description: "Comments won't show on the site without approval",
      initialValue: false
    }),
  ],
  preview: {
    select: {
      name: 'name',
      comment: 'comment',
      post: 'post.title'
    },
    prepare({name, comment, post}) {
      return {
        title: `${name} on ${post}`,
        subtitle: comment
      }
    }
  }
})
