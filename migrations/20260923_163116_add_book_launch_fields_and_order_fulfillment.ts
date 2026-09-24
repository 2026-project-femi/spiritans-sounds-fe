import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// NOTE: This migration is intentionally written to be idempotent
// (`IF NOT EXISTS` / guarded enums and constraints). It is additive and must be
// safe to re-run if the target database already contains some of these objects.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $do$ BEGIN CREATE TYPE "public"."enum_orders_format" AS ENUM('ebook', 'paperback'); EXCEPTION WHEN duplicate_object THEN NULL; END $do$;
  DO $do$ BEGIN CREATE TYPE "public"."enum_orders_fulfillment_status" AS ENUM('pending', 'packed', 'dispatched', 'delivered', 'cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $do$;
  CREATE TABLE IF NOT EXISTS "book_launch_settings_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "book_launch_settings_audio_previews" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"audio_file_id" uuid,
  	"audio_url" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "book_launch_settings_bookshops" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"address" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"phone" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "book_launch_settings_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"detail" varchar,
  	"quote" varchar NOT NULL
  );
  
  ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "format" "enum_orders_format" DEFAULT 'ebook';
  ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "is_preorder" boolean DEFAULT false;
  ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_address" varchar;
  ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_city" varchar;
  ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_country" varchar;
  ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "shipping_phone" varchar;
  ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "fulfillment_status" "enum_orders_fulfillment_status" DEFAULT 'pending';
  ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "dispatched_at" timestamp(3) with time zone;
  ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "courier" varchar;
  ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "tracking_number" varchar;
  ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "admin_notes" varchar;
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "launch_date_i_s_o" varchar DEFAULT '2026-11-21T17:00:00+01:00';
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "stream_go_live" boolean DEFAULT false;
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "youtube_stream_url" varchar;
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "facebook_stream_url" varchar;
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "publisher" varchar DEFAULT 'Spiritans Sound';
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "imprint" varchar DEFAULT 'Treasures Unveiler';
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "publication_date" varchar DEFAULT '21 November 2026';
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "language" varchar DEFAULT 'English';
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "pages" varchar DEFAULT '320 pages';
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "isbn" varchar DEFAULT '978-978-782-140-3';
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "category" varchar DEFAULT 'Christian Living · Relationships · Psychology';
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "is_preorder" boolean DEFAULT true;
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "publication_id" uuid;
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "ebook_price_n_g_n" numeric DEFAULT 5000 NOT NULL;
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "ebook_price_u_s_d" numeric DEFAULT 10 NOT NULL;
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "ebook_price_g_b_p" numeric DEFAULT 8 NOT NULL;
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "paperback_price_n_g_n" numeric DEFAULT 12000 NOT NULL;
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "paperback_price_u_s_d" numeric DEFAULT 25 NOT NULL;
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "paperback_price_g_b_p" numeric DEFAULT 20 NOT NULL;
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "preview_chapter_title" varchar DEFAULT 'From Chapter One — The Veil';
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "preview_chapter" jsonb;
  DO $do$ BEGIN
    ALTER TABLE "book_launch_settings_videos" ADD CONSTRAINT "book_launch_settings_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."book_launch_settings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $do$;
  DO $do$ BEGIN
    ALTER TABLE "book_launch_settings_audio_previews" ADD CONSTRAINT "book_launch_settings_audio_previews_audio_file_id_media_id_fk" FOREIGN KEY ("audio_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $do$;
  DO $do$ BEGIN
    ALTER TABLE "book_launch_settings_audio_previews" ADD CONSTRAINT "book_launch_settings_audio_previews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."book_launch_settings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $do$;
  DO $do$ BEGIN
    ALTER TABLE "book_launch_settings_bookshops" ADD CONSTRAINT "book_launch_settings_bookshops_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."book_launch_settings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $do$;
  DO $do$ BEGIN
    ALTER TABLE "book_launch_settings_testimonials" ADD CONSTRAINT "book_launch_settings_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."book_launch_settings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $do$;
  CREATE INDEX IF NOT EXISTS "book_launch_settings_videos_order_idx" ON "book_launch_settings_videos" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "book_launch_settings_videos_parent_id_idx" ON "book_launch_settings_videos" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "book_launch_settings_audio_previews_order_idx" ON "book_launch_settings_audio_previews" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "book_launch_settings_audio_previews_parent_id_idx" ON "book_launch_settings_audio_previews" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "book_launch_settings_audio_previews_audio_file_idx" ON "book_launch_settings_audio_previews" USING btree ("audio_file_id");
  CREATE INDEX IF NOT EXISTS "book_launch_settings_bookshops_order_idx" ON "book_launch_settings_bookshops" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "book_launch_settings_bookshops_parent_id_idx" ON "book_launch_settings_bookshops" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "book_launch_settings_testimonials_order_idx" ON "book_launch_settings_testimonials" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "book_launch_settings_testimonials_parent_id_idx" ON "book_launch_settings_testimonials" USING btree ("_parent_id");
  DO $do$ BEGIN
    ALTER TABLE "book_launch_settings" ADD CONSTRAINT "book_launch_settings_publication_id_publications_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publications"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $do$;
  CREATE INDEX IF NOT EXISTS "book_launch_settings_publication_idx" ON "book_launch_settings" USING btree ("publication_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE IF EXISTS "book_launch_settings_videos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "book_launch_settings_audio_previews" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "book_launch_settings_bookshops" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "book_launch_settings_testimonials" DISABLE ROW LEVEL SECURITY;
  DROP TABLE IF EXISTS "book_launch_settings_videos" CASCADE;
  DROP TABLE IF EXISTS "book_launch_settings_audio_previews" CASCADE;
  DROP TABLE IF EXISTS "book_launch_settings_bookshops" CASCADE;
  DROP TABLE IF EXISTS "book_launch_settings_testimonials" CASCADE;
  ALTER TABLE IF EXISTS "book_launch_settings" DROP CONSTRAINT IF EXISTS "book_launch_settings_publication_id_publications_id_fk";
  
  DROP INDEX IF EXISTS "book_launch_settings_publication_idx";
  ALTER TABLE IF EXISTS "orders" DROP COLUMN IF EXISTS "format";
  ALTER TABLE IF EXISTS "orders" DROP COLUMN IF EXISTS "is_preorder";
  ALTER TABLE IF EXISTS "orders" DROP COLUMN IF EXISTS "shipping_address";
  ALTER TABLE IF EXISTS "orders" DROP COLUMN IF EXISTS "shipping_city";
  ALTER TABLE IF EXISTS "orders" DROP COLUMN IF EXISTS "shipping_country";
  ALTER TABLE IF EXISTS "orders" DROP COLUMN IF EXISTS "shipping_phone";
  ALTER TABLE IF EXISTS "orders" DROP COLUMN IF EXISTS "fulfillment_status";
  ALTER TABLE IF EXISTS "orders" DROP COLUMN IF EXISTS "dispatched_at";
  ALTER TABLE IF EXISTS "orders" DROP COLUMN IF EXISTS "courier";
  ALTER TABLE IF EXISTS "orders" DROP COLUMN IF EXISTS "tracking_number";
  ALTER TABLE IF EXISTS "orders" DROP COLUMN IF EXISTS "admin_notes";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "launch_date_i_s_o";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "stream_go_live";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "youtube_stream_url";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "facebook_stream_url";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "publisher";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "imprint";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "publication_date";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "language";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "pages";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "isbn";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "category";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "is_preorder";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "publication_id";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "ebook_price_n_g_n";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "ebook_price_u_s_d";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "ebook_price_g_b_p";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "paperback_price_n_g_n";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "paperback_price_u_s_d";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "paperback_price_g_b_p";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "preview_chapter_title";
  ALTER TABLE IF EXISTS "book_launch_settings" DROP COLUMN IF EXISTS "preview_chapter";
  DROP TYPE IF EXISTS "public"."enum_orders_format";
  DROP TYPE IF EXISTS "public"."enum_orders_fulfillment_status";`)
}
