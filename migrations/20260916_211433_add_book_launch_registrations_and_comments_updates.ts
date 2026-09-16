import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "book_launch_registrations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"whatsapp" varchar,
  	"country" varchar,
  	"book" varchar DEFAULT 'Behind the Veil' NOT NULL,
  	"book_slug" varchar DEFAULT 'behind-the-veil' NOT NULL,
  	"source" varchar DEFAULT 'landing-page',
  	"reminder_sent" boolean DEFAULT false,
  	"attended" boolean DEFAULT false,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "comments" ADD COLUMN "parent_id" uuid;
  ALTER TABLE "comments" ADD COLUMN "reactions" jsonb DEFAULT '{}'::jsonb;
  ALTER TABLE "comments_rels" ADD COLUMN "events_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "book_launch_registrations_id" uuid;
  CREATE INDEX "book_launch_registrations_full_name_idx" ON "book_launch_registrations" USING btree ("full_name");
  CREATE INDEX "book_launch_registrations_email_idx" ON "book_launch_registrations" USING btree ("email");
  CREATE INDEX "book_launch_registrations_updated_at_idx" ON "book_launch_registrations" USING btree ("updated_at");
  CREATE INDEX "book_launch_registrations_created_at_idx" ON "book_launch_registrations" USING btree ("created_at");
  ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "comments_rels" ADD CONSTRAINT "comments_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_book_launch_registrations_fk" FOREIGN KEY ("book_launch_registrations_id") REFERENCES "public"."book_launch_registrations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "comments_parent_idx" ON "comments" USING btree ("parent_id");
  CREATE INDEX "comments_rels_events_id_idx" ON "comments_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_book_launch_registrations__idx" ON "payload_locked_documents_rels" USING btree ("book_launch_registrations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "book_launch_registrations" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "book_launch_registrations" CASCADE;
  ALTER TABLE "comments" DROP CONSTRAINT "comments_parent_id_comments_id_fk";
  
  ALTER TABLE "comments_rels" DROP CONSTRAINT "comments_rels_events_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_book_launch_registrations_fk";
  
  DROP INDEX "comments_parent_idx";
  DROP INDEX "comments_rels_events_id_idx";
  DROP INDEX "payload_locked_documents_rels_book_launch_registrations__idx";
  ALTER TABLE "comments" DROP COLUMN "parent_id";
  ALTER TABLE "comments" DROP COLUMN "reactions";
  ALTER TABLE "comments_rels" DROP COLUMN "events_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "book_launch_registrations_id";`)
}
