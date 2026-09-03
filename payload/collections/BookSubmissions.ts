import { anyone } from '@/access/anyone'
import { isAdmin, isAdminOrPublishingAdmin } from '@/access/roles'
import { CollectionConfig, CollectionAfterChangeHook } from 'payload'
import { sendBookApprovalEmail } from '@/lib/emails/sendEmail'
import crypto from 'crypto'

const handleBookApproval: CollectionAfterChangeHook = async ({ doc, previousDoc, req: { payload } }) => {
  if (doc.status === 'approved' && previousDoc.status !== 'approved') {
    let tempPassword = crypto.randomBytes(8).toString('hex')
    let userId: string
    let isNewUser = false

    if (doc.submitter) {
      userId = typeof doc.submitter === 'object' ? doc.submitter.id : doc.submitter;
    } else {
      const usersRes = await payload.find({
        collection: 'users',
        where: { email: { equals: doc.email } },
      })

      if (usersRes.totalDocs > 0) {
        userId = usersRes.docs[0].id
      } else {
        isNewUser = true
        const newUser = await payload.create({
          collection: 'users',
          data: {
            email: doc.email,
            password: tempPassword,
            name: doc.fullName,
            role: 'author',
            authorType: 'standard',
            authorBio: doc.authorBio || '',
            bankDetails: doc.bankDetails,
          },
        })
        userId = newUser.id
      }
    }

    const slug = doc.bookTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    await payload.create({
      collection: 'publications',
      data: {
        title: doc.bookTitle,
        description: doc.description,
        slug,
        author: userId,
        price: doc.sellingPrice > 0 ? 'paid' : 'free',
        priceAmount: doc.sellingPrice,
        cover: doc.bookCover,
        file: doc.bookPdf,
        category: doc.category,
        publishingStatus: 'published',
        _status: 'published',
        publishedAt: new Date().toISOString(),
      },
    })

    const loginUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/unveiler/login`
    await sendBookApprovalEmail({
      email: doc.email,
      fullName: doc.fullName,
      bookTitle: doc.bookTitle,
      loginUrl,
      tempPassword: isNewUser ? tempPassword : undefined,
    })
  }
}

export const BookSubmissions: CollectionConfig = {
  slug: 'book-submissions',
  hooks: {
    afterChange: [handleBookApproval],
  },
  admin: {
    useAsTitle: 'bookTitle',
    hidden: ({user})=>user.role === 'contributor' || user.role === 'author' || user.role === 'editor',
  },
  access: {
    read: isAdminOrPublishingAdmin,
    update: isAdminOrPublishingAdmin,
    delete: isAdmin,
    create: anyone,
  },
  fields: [
    {
      name: 'submitter',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'country',
      type: 'text',
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
    },
    {
      name: 'bookTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'authorBio',
      type: 'textarea',
    },
    {
      name: 'sellingPrice',
      type: 'number',
      required: true,
    },
    {
      name: 'bookCover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bookPdf',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bankDetails',
      type: 'group',
      fields: [
        { name: 'bankName', type: 'text' },
        { name: 'accountName', type: 'text' },
        { name: 'accountNumber', type: 'text' },
        { name: 'sortCodeOrRoutingNumber', type: 'text' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'pending',
    },
  ],
}
