import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Migration: publish_existing_docs
 *
 * When draft/versions support is enabled on a collection for the first time,
 * Payload adds a `_status` column to the table. Existing rows get NULL by default,
 * which causes them to be invisible to `authenticatedOrPublished` access control.
 *
 * This migration sets `_status = 'published'` for all pre-existing documents
 * across the 7 newly draft-enabled collections so no content disappears
 * from the live site after deploy.
 *
 * Safe to run multiple times (WHERE _status IS NULL guard).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  const tables = [
    'article',
    'homily',
    'prayer',
    'music',
    'events',
    'magazine_issues',
    'publications',
  ]

  for (const table of tables) {
    try {
      await db.execute(
        sql.raw(
          `UPDATE "${table}" SET "_status" = 'published' WHERE "_status" IS NULL`
        )
      )
    } catch (e: any) {
      // Table may not exist yet on a fresh install — that's fine, skip it
      if (!e.message?.includes('does not exist')) {
        throw e
      }
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Intentionally a no-op: we cannot safely "un-publish" documents
  // without knowing their original state before this migration ran.
}
