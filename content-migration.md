# MISSION

Write a production-safe content migration script at `scripts/migrate-sanity.ts` that exports content from Sanity.io and imports it into Payload CMS v3, targeting both a production PostgreSQL database and Cloudflare R2 object storage. The script must be environment-aware, idempotent, and safe to run multiple times.

# CRITICAL FIRST STEP — UNDERSTAND BOTH SOURCE AND TARGET

Before writing the migration script, you MUST read and analyze:

- The existing Sanity schemas in `/sanity/` — understand every document type, field, reference, and asset
- The new Payload configuration in `payload.config.ts` — understand every collection and field mapping
- `SETUP.md` — understand the production environment variables and service configurations
- The Sanity client setup in `sanity/lib/client.ts` — understand how to query the Sanity API
- The Payload Local API patterns — understand how to create documents programmatically

---

# SYSTEM ARCHITECTURE FOR MIGRATION

| Component      | Local/Staging                      | Production                              |
| -------------- | ---------------------------------- | --------------------------------------- |
| Source         | Sanity.io API (CDN or live)        | Sanity.io API (CDN or live)             |
| Target DB      | PostgreSQL Docker `127.0.0.1:5432` | PostgreSQL (your production host)       |
| Target Storage | Local filesystem (`media/`)        | Cloudflare R2                           |
| Runtime        | `ts-node` or `tsx` locally         | `ts-node` or `tsx` on production server |

## Environment Detection Strategy

The script MUST detect its target environment and adapt behavior:

```typescript
// In scripts/migrate-sanity.ts
import "dotenv/config"; // Load .env file

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// Database connection — uses POSTGRES_URL from environment
const POSTGRES_URL = process.env.POSTGRES_URL!;

// Storage behavior
// - Production: Files go to Cloudflare R2 via Payload's S3 plugin
// - Local: Files go to local filesystem (media/ directory)
```
