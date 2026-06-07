# MISSION

You are an expert full-stack developer specializing in Next.js 16 (App Router), React 19, Tailwind v4, and Payload CMS v3. Your task is to migrate the "Spiritans Sound" project from Sanity.io to Payload CMS v3. You must first thoroughly review the existing Sanity implementation (schemas, queries, types, and client utilities) to understand the current data model, then plan and execute a phased migration to Payload CMS with PostgreSQL.

# CRITICAL FIRST STEP — READ & UNDERSTAND THE CURRENT SYSTEM

Before writing a single line of code, you MUST read and analyze these files completely:

- `SETUP.md` — full project context, tech stack, environment variables, and service integrations
- All files in `sanity/` directory — schemas, client configuration, GROQ queries, image helpers, live preview setup
- `lib/types.ts` — TypeScript interfaces derived from Sanity schemas
- `lib/queries.ts` — all GROQ query strings used across the app
- `components/PortableTextComponents.tsx` — custom Portable Text renderers (especially YouTube embeds)
- `next.config.ts` — current image domain configuration for Sanity CDN
- `package.json` — all current Sanity-related dependencies

This analysis phase is MANDATORY. Do not skip it. The Sanity schemas ARE your source of truth for the new Payload collections.

---

# SYSTEM ARCHITECTURE (TARGET STATE)

| Layer                     | Technology                | Details                                                     |
| ------------------------- | ------------------------- | ----------------------------------------------------------- |
| Framework                 | Next.js 16.1.1            | App Router, React 19.2.3                                    |
| Styling                   | Tailwind CSS v4           | Do NOT modify `app/globals.css` theme variables             |
| CMS                       | Payload CMS v3            | Self-hosted within Next.js                                  |
| Database                  | PostgreSQL                | Docker container already running, bound to `127.0.0.1:5432` |
| ORM/Adapter               | `@payloadcms/db-postgres` | Native Postgres adapter                                     |
| Rich Text                 | Lexical                   | `@payloadcms/richtext-lexical`                              |
| File Storage (Production) | Cloudflare R2             | `@payloadcms/plugin-cloud-storage` with S3 adapter          |
| File Storage (Local/Test) | Local filesystem          | `payload` default `upload` directory                        |
| Process Manager           | PM2                       | Bare-metal Ubuntu (no Docker for Next.js)                   |

## Storage Strategy — Environment-Aware

**Detect environment at runtime** and switch storage adapter accordingly:

```typescript
// In payload.config.ts
const isProduction = process.env.NODE_ENV === "production";

const storageAdapter = isProduction
  ? s3Adapter({
      bucket: process.env.S3_BUCKET!,
      config: {
        endpoint: process.env.S3_ENDPOINT!,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        region: "auto", // Cloudflare R2 uses 'auto'
      },
    })
  : undefined; // Falls back to local filesystem storage
```
