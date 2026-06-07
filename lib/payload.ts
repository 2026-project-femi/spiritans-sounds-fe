

import { getPayload } from 'payload'
import config from '@/payload.config'


export async function getSidebarData() {
    const payload = await getPayload({ config })

  const [homilyResult, articlesResult] = await Promise.all([
    payload.find({
      collection: 'homily',
      sort: '-publishedAt',
      limit: 5,
      depth: 1,
    //   where: { _status: { equals: 'published' } },
    }),
    payload.find({
      collection: 'article',
      sort: '-publishedAt',
      limit: 5,
      depth: 1,
    //   where: { _status: { equals: 'published' } },
    }),
  ])
const mapToPost = (doc: any, type: 'homily' | 'article') => ({
  _id: String(doc.id),
  title: doc.title,
  slug: doc.slug,
  publishedAt: doc.publishedAt,
  type,
  imageUrl: doc.featuredImage?.url ?? null,
})
  const combinedPosts = [
   ...homilyResult.docs.map((doc) => mapToPost(doc, 'homily')),
...articlesResult.docs.map((doc) => mapToPost(doc, 'article')),
  ]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3)

  return {
    categories: [] as string[],  // empty until you create the collection
    recentPosts: combinedPosts,
  }
}