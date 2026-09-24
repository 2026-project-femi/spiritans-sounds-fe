import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// NOTE: This migration is intentionally written to be idempotent
// (`IF NOT EXISTS` / guarded constraints). It is additive and must be safe to
// re-run if the target database already contains some of these objects.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "page_views" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"path" varchar NOT NULL,
  	"title" varchar,
  	"views" numeric DEFAULT 0 NOT NULL,
  	"last_viewed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "views" numeric DEFAULT 0;
  ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "version_views" numeric DEFAULT 0;
  ALTER TABLE "prayer" ADD COLUMN IF NOT EXISTS "views" numeric DEFAULT 0;
  ALTER TABLE "_prayer_v" ADD COLUMN IF NOT EXISTS "version_views" numeric DEFAULT 0;
  ALTER TABLE "music" ADD COLUMN IF NOT EXISTS "views" numeric DEFAULT 0;
  ALTER TABLE "_music_v" ADD COLUMN IF NOT EXISTS "version_views" numeric DEFAULT 0;
  ALTER TABLE "magazine_issues" ADD COLUMN IF NOT EXISTS "views" numeric DEFAULT 0;
  ALTER TABLE "_magazine_issues_v" ADD COLUMN IF NOT EXISTS "version_views" numeric DEFAULT 0;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "page_views_id" uuid;
  CREATE UNIQUE INDEX IF NOT EXISTS "page_views_path_idx" ON "page_views" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "page_views_updated_at_idx" ON "page_views" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "page_views_created_at_idx" ON "page_views" USING btree ("created_at");
  DO $do$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_views_fk" FOREIGN KEY ("page_views_id") REFERENCES "public"."page_views"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $do$;
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_page_views_id_idx" ON "payload_locked_documents_rels" USING btree ("page_views_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE IF EXISTS "page_views" DISABLE ROW LEVEL SECURITY;
  DROP TABLE IF EXISTS "page_views" CASCADE;
  ALTER TABLE IF EXISTS "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_page_views_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_page_views_id_idx";
  ALTER TABLE IF EXISTS "events" DROP COLUMN IF EXISTS "views";
  ALTER TABLE IF EXISTS "_events_v" DROP COLUMN IF EXISTS "version_views";
  ALTER TABLE IF EXISTS "prayer" DROP COLUMN IF EXISTS "views";
  ALTER TABLE IF EXISTS "_prayer_v" DROP COLUMN IF EXISTS "version_views";
  ALTER TABLE IF EXISTS "music" DROP COLUMN IF EXISTS "views";
  ALTER TABLE IF EXISTS "_music_v" DROP COLUMN IF EXISTS "version_views";
  ALTER TABLE IF EXISTS "magazine_issues" DROP COLUMN IF EXISTS "views";
  ALTER TABLE IF EXISTS "_magazine_issues_v" DROP COLUMN IF EXISTS "version_views";
  ALTER TABLE IF EXISTS "payload_locked_documents_rels" DROP COLUMN IF EXISTS "page_views_id";`)
}
