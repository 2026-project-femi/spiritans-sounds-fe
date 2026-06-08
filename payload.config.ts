import { buildConfig } from 'payload'
// import { plugins as bundledPlugins } from './payload/plugins'

import { postgresAdapter } from '@payloadcms/db-postgres'
// import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { Users } from './payload/collections/Users'
import { Media } from './payload/collections/Media'
import { Articles } from './payload/collections/Articles'
import { Events } from './payload/collections/Events'
import { Homilies } from './payload/collections/Homilies'
import { Prayers } from './payload/collections/Prayers'
import { Music } from './payload/collections/Music'
import { Publications } from './payload/collections/Publications'
import { MagazineIssues } from './payload/collections/MagazineIssues'
import { Comments } from './payload/collections/Comments'
import { Subscribers } from './payload/collections/Subscribers'
import { EmailCampaigns } from './payload/collections/EmailCampaigns'
import { Orders } from './payload/collections/Orders'


import { HomePage } from './payload/collections/Home'
import { DonationPage } from './payload/collections/DonationPage'
import { ContactPage } from './payload/collections/ContactPage'
import { Radio } from './payload/collections/Radio'
import { MagazineLanding } from './payload/collections/MagazineLanding'
import { s3Storage } from '@payloadcms/storage-s3'

import { Posts } from './payload/collections/Posts'
import { Pages } from './payload/collections/Pages'
import { Categories } from './payload/collections/Categories'



// =======================================
import { Footer } from '@/payload/Footer/config'
import { Header } from '@/payload/Header/config'
import { plugins } from '@/payload/plugins'
import { defaultLexical } from '@/payload/fields/defaultLexical'
import { getServerSideURL } from '@/payload/utilities/getURL'
// ==============================

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProduction = process.env.NODE_ENV === "production";

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [ Users, Media, Articles, Events, Homilies, Prayers, Music, Publications, MagazineIssues, Comments, Subscribers, EmailCampaigns, Orders, Posts, Pages,Categories,MagazineLanding,Radio,ContactPage,DonationPage,HomePage],
  globals: [ Footer, Header],
  editor: defaultLexical,
  secret: process.env.PAYLOAD_SECRET || 'DEVELOPMENT_ONLY_SECRET_STRING_12345',
  cors: [getServerSideURL()].filter(Boolean),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || 'postgresql://postgres:local_dev_password@127.0.0.1:5432/spiritans_sound_dev',
    },
    idType: 'uuid',
  }),
  plugins: [
    ...plugins,
    ...(isProduction && process.env.S3_BUCKET
      ? [
          s3Storage({
            collections: {
              media: true,
            },
            bucket: process.env.S3_BUCKET!,
            config: {
              endpoint: process.env.S3_ENDPOINT!,
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID!,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
              },
              region: 'auto',
            },
          })
        ]
      : []),
      
  ],
  
  
})
