import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished';
import { isAdmin, isAdminOrEditor } from '@/access/roles';
import { publishedAtField } from '@/payload/fields/statusField';
import { revalidatePath } from 'next/cache';
import { CollectionConfig, CollectionAfterChangeHook } from 'payload'
import { sendPurchaseConfirmationEmail } from '@/lib/emails/sendEmail';

const handlePreorderRelease: CollectionAfterChangeHook = async ({ doc, previousDoc, req: { payload } }) => {
  if (previousDoc?.isPreorder === true && doc.isPreorder === false) {
    // Fetch all completed orders for this book
    const ordersRes = await payload.find({
      collection: 'orders',
      where: {
        and: [
          { 'items.value': { equals: doc.id } },
          { status: { equals: 'completed' } }
        ]
      },
      limit: 1000,
    });
    
    // We only process if doc.file exists
    const fileUrl = doc.file && typeof doc.file === 'object' ? doc.file.url : null;
    if (!fileUrl) {
      console.error(`Book released, but no file attached for ${doc.title}`);
      return doc;
    }
    
    const downloadUrl = `${fileUrl}?dl=${encodeURIComponent((doc.title ?? "download") + ".pdf")}`;
    const formattedDate = new Date().toLocaleDateString("en-NG", {
        year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
    });

    for (const order of ordersRes.docs) {
      if (order.customerEmail) {
        await sendPurchaseConfirmationEmail({
          to: order.customerEmail,
          subject: `Your Pre-order is Now Available — ${doc.title}`,
          buyerName: order.customerName || order.customerEmail.split('@')[0],
          itemTitle: doc.title,
          downloadUrl,
          amount: order.amount || 0,
          currency: order.currency || 'NGN',
          transactionReference: order.paystackReference || order.stripeSessionId || 'PREORDER',
          date: formattedDate,
        }).catch(e => console.error("Failed to send release email to", order.customerEmail, e));
      }
    }
  }
  return doc;
};

export const Publications: CollectionConfig = {
  slug: 'publications',
  admin: {
    useAsTitle: 'title',
    hidden: ({user})=>user.role === 'contributor',
    defaultColumns: ['title', 'views', 'totalSales', '_status', 'publishedAt', 'updatedAt'],
  },
  access: {
    read: authenticatedOrPublished,
    readVersions: authenticated,
    update: ({ req: { user } }) => {
      if (user?.role === 'admin' || user?.role === 'publishing_admin') return true;
      // Authors can only update their own draft/under_review books if we wanted, but let's stick to admins for now
      return false;
    },
    delete: isAdmin,
    create: ({ req: { user } }) => {
      return Boolean(user?.role === 'admin' || user?.role === 'editor' || user?.role === 'publishing_admin');
    },
    
  },hooks: {
    afterChange: [({doc})=>{
      revalidatePath('/unveiler/books');
      revalidatePath(`/unveiler/books/${doc.slug}`);
      return doc;
    }, handlePreorderRelease],
    afterDelete: [({doc})=>{
      revalidatePath('/unveiler/books');
      revalidatePath(`/unveiler/books/${doc.slug}`);
      return doc;
    }],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        position: 'sidebar',
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
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'price',
      type: 'select',
      defaultValue: 'free',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Paid', value: 'paid' },
      ],
    },
    {
      name: 'priceAmount',
      type: 'number',
    },
    {
      name: 'priceAmountUSD',
      type: 'number',
    },
    {
      name: 'priceAmountGBP',
      type: 'number',
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishingStatus',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Under Review', value: 'under_review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Published', value: 'published' },
        { label: 'Suspended', value: 'suspended' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isPreorder',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'If checked, the book will be sold as a pre-order and download links will not be sent until unchecked.',
      },
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Total number of book detail page views',
      },
    },
    {
      name: 'totalSales',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'grossRevenue',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
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
}
