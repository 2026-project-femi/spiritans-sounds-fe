import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "page_views" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"path" varchar NOT NULL,
  	"title" varchar,
  	"views" numeric DEFAULT 0 NOT NULL,
  	"last_viewed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "events" ADD COLUMN "views" numeric DEFAULT 0;
  ALTER TABLE "_events_v" ADD COLUMN "version_views" numeric DEFAULT 0;
  ALTER TABLE "prayer" ADD COLUMN "views" numeric DEFAULT 0;
  ALTER TABLE "_prayer_v" ADD COLUMN "version_views" numeric DEFAULT 0;
  ALTER TABLE "music" ADD COLUMN "views" numeric DEFAULT 0;
  ALTER TABLE "_music_v" ADD COLUMN "version_views" numeric DEFAULT 0;
  ALTER TABLE "magazine_issues" ADD COLUMN "views" numeric DEFAULT 0;
  ALTER TABLE "_magazine_issues_v" ADD COLUMN "version_views" numeric DEFAULT 0;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "page_views_id" uuid;
  CREATE UNIQUE INDEX "page_views_path_idx" ON "page_views" USING btree ("path");
  CREATE INDEX "page_views_updated_at_idx" ON "page_views" USING btree ("updated_at");
  CREATE INDEX "page_views_created_at_idx" ON "page_views" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_views_fk" FOREIGN KEY ("page_views_id") REFERENCES "public"."page_views"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_page_views_id_idx" ON "payload_locked_documents_rels" USING btree ("page_views_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "page_views" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "page_views" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_page_views_fk";
  
  DROP INDEX "payload_locked_documents_rels_page_views_id_idx";
  ALTER TABLE "events" DROP COLUMN "views";
  ALTER TABLE "_events_v" DROP COLUMN "version_views";
  ALTER TABLE "prayer" DROP COLUMN "views";
  ALTER TABLE "_prayer_v" DROP COLUMN "version_views";
  ALTER TABLE "music" DROP COLUMN "views";
  ALTER TABLE "_music_v" DROP COLUMN "version_views";
  ALTER TABLE "magazine_issues" DROP COLUMN "views";
  ALTER TABLE "_magazine_issues_v" DROP COLUMN "version_views";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "page_views_id";`)
}
