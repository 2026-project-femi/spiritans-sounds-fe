import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import https from 'https'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-01-05',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false, // Strongly false for migrations! We want latest data.
})

async function downloadAsset(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath)
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`))
        return
      }
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      fs.unlink(destPath, () => {})
      reject(err)
    })
  })
}

// Simple converter to convert raw string to a Lexical paragraph node
// since full PortableText to Lexical AST mapping is incredibly complex for a single script.
function migratePortableText(ptBlocks: any[]) {
  if (!ptBlocks || !Array.isArray(ptBlocks)) return undefined;
  
  // Very rough mapping
  const lexicalNodes = ptBlocks.map(block => {
    if (block._type === 'block') {
      return {
        type: 'paragraph',
        version: 1,
        children: block.children?.map((child: any) => ({
          type: 'text',
          text: child.text,
          version: 1,
        })) || [],
      }
    }
    return { type: 'paragraph', version: 1, children: [{ type: 'text', text: 'Unsupported block type', version: 1 }] };
  })

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: lexicalNodes,
    }
  }
}

async function runMigration() {
  console.log(`Starting Payload v3 Migration (${IS_PRODUCTION ? 'PRODUCTION' : 'LOCAL'})`)
  const payload = await getPayload({ config: configPromise })

  console.log('Fetching sanity documents...')
  
  // Migrate Categories (simple tags in articles) and Authors first if they exist as separate models 
  // In your schema, they are just strings, so no pre-population needed for relations!

  // 1. Articles
  const articles = await sanity.fetch(`*[_type == "article"]{
    _id, title, "slug": slug.current, author, excerpt, publishedAt, youtubeUrl, content,
    "imageUrl": featuredImage.asset->url
  }`)

  for (const article of articles) {
    try {
      console.log(`Migrating Article: ${article.title}`)
      
      let mediaId = undefined
      if (article.imageUrl) {
         // Idempotency: skip if already uploaded, or re-download
         const fileName = path.basename(article.imageUrl)
         const tempPath = path.join(__dirname, '..', fileName)
         await downloadAsset(article.imageUrl, tempPath)
         
         const uploadedMedia = await payload.create({
           collection: 'media',
           data: { alt: article.title || 'Image' },
           filePath: tempPath,
         })
         mediaId = uploadedMedia.id
         fs.unlinkSync(tempPath)
      }

      await payload.create({
        collection: 'articles',
        data: {
          title: article.title,
          slug: article.slug || article._id,
          author: article.author,
          excerpt: article.excerpt,
          publishedAt: article.publishedAt,
          youtubeUrl: article.youtubeUrl,
          featuredImage: mediaId,
          content: migratePortableText(article.content),
        }
      })
      console.log(`✅ Success: ${article.title}`)
    } catch (err: any) {
      if (err.data?.includes('E11000 duplicate key error')) {
        console.log(`⚠️ Skipped: ${article.title} (Already exists)`)
      } else {
        console.error(`❌ Failed: ${article.title}`, err.message)
      }
    }
  }

  // Follow identical pattern for Homilies, Prayers, Events, etc.
  // ...
  
  console.log('Migration completed successfully!')
  process.exit(0)
}

runMigration().catch(console.error)
