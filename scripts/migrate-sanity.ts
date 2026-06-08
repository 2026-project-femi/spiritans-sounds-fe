import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '../payload.config'
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-01-05',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

/**
 * -----------------------------
 * Helpers
 * -----------------------------
 */

function logSuccess(msg: string) {
  console.log(`✅ ${msg}`)
}

function logError(msg: string, err?: any) {
  console.error(`❌ ${msg}`, err?.message || err)
}

async function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)

    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed download: ${url}`))
          return
        }

        res.pipe(file)

        file.on('finish', () => {
          file.close(() => {
            resolve()
          })
        })
      })
      .on('error', (err) => {
        fs.unlink(dest, () => {})
        reject(err)
      })
  })
}
/**
 * -----------------------------
 * PortableText → Lexical
 * -----------------------------
 * Safe Payload v3 structure
 */
function portableTextToLexical(blocks: any[]) {
  if (!Array.isArray(blocks)) return null

  return {
    root: {
      type: 'root',
      direction: null,
      format: '',
      indent: 0,
      version: 1,
      children: blocks.map((block) => ({
        type: 'paragraph',
        direction: null,
        format: '',
        indent: 0,
        textFormat: 0,
        textStyle: '',
        version: 1,
        children: (block.children || []).map((child: any) => ({
          type: 'text',
          text: child.text || '',
          detail: 0,
          format: child.marks?.includes('strong') ? 1 : 0,
          mode: 'normal',
          style: '',
          version: 1,
        })),
      })),
    },
  }
}

/**
 * -----------------------------
 * Main Migration
 * -----------------------------
 */
async function runMigration() {
  const payload = await getPayload({ config: configPromise })

  console.log('🚀 Starting migration...')

  /**
   * -----------------------------
   * ARTICLES
   * -----------------------------
   */
  const articles = await sanity.fetch(`
    *[_type == "article"]{
      _id,
      title,
      "slug": slug.current,
      author,
      excerpt,
      publishedAt,
      youtubeUrl,
      content,
      "imageUrl": featuredImage.asset->url
    }
  `)

  for (const article of articles) {
    let tempFile: string | null = null

    try {
      console.log(`\nMigrating: ${article.title}`)

      /**
       * -----------------------------
       * MEDIA MIGRATION (safe)
       * -----------------------------
       */
      let mediaId: string | undefined

      if (article.imageUrl) {
        const fileName = path.basename(article.imageUrl)
        tempFile = path.join(__dirname, '..', 'tmp-' + fileName)

        await downloadFile(article.imageUrl, tempFile)

        const uploaded = await payload.create({
          collection: 'media',
          data: {
            alt: article.title || 'image',
          },
          filePath: tempFile,
        })

        mediaId = uploaded.id
      }

      /**
       * -----------------------------
       * ARTICLE CREATE (idempotent-safe recommended)
       * -----------------------------
       */

      await payload.create({
        collection: 'article', // IMPORTANT: plural
        data: {
          title: article.title,
          slug: article.slug || article._id,
          author: article.author,
          excerpt: article.excerpt,
          publishedAt: article.publishedAt,
          youtubeUrl: article.youtubeUrl,
          featuredImage: mediaId,
          content: portableTextToLexical(article.content) as any,
        },
      })

      logSuccess(article.title)
    } catch (err: any) {
      if (err?.message?.includes('E11000')) {
        console.log(`⚠️ Skipped duplicate: ${article.title}`)
      } else {
        logError(`Failed: ${article.title}`, err)
      }
    } finally {
      /**
       * -----------------------------
       * CLEANUP TEMP FILES
       * -----------------------------
       */
      if (tempFile && fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile)
      }
    }
  }

  console.log('\n🎉 Migration completed')
  process.exit(0)
}

runMigration().catch((err) => {
  console.error('Fatal migration error:', err)
  process.exit(1)
})