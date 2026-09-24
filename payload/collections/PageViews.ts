import { isAdmin, isAdminOrPublishingAdmin } from '@/access/roles'
import type { CollectionConfig } from 'payload'

/**
 * Lightweight, self-hosted page-view counter for public frontend routes.
 * One row per unique path, incremented by `/api/analytics/track-pageview`.
 * This powers basic analytics for pages that are not backed by a content
 * collection (e.g. the donations page, static marketing pages).
 */
export const PageViews: CollectionConfig = {
  slug: 'pageViews',
  labels: {
    singular: 'Page View',
    plural: 'Page Views',
  },
  admin: {
    useAsTitle: 'path',
    defaultColumns: ['path', 'title', 'views', 'lastViewedAt', 'updatedAt'],
    description: 'Aggregated public page views, grouped by URL path.',
    hidden: ({ user }) => user?.role !== 'admin' && user?.role !== 'publishing_admin',
  },
  access: {
    read: isAdminOrPublishingAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'path',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Normalized URL path, e.g. /donations',
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Most recently recorded page title for this path.',
      },
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
      required: true,
      admin: {
        readOnly: true,
        description: 'Total number of recorded page views for this path.',
      },
    },
    {
      name: 'lastViewedAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}
