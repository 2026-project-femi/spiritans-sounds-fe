import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_article_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__article_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_event_type" AS ENUM('celebration', 'workshop', 'retreat', 'concert', 'symposium', 'news', 'other');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_homily_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__homily_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_prayer_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__prayer_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_music_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__music_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_publications_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__publications_v_version_price" AS ENUM('free', 'paid');
  CREATE TYPE "public"."enum__publications_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_magazine_issues_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__magazine_issues_v_version_price" AS ENUM('free', 'paid');
  CREATE TYPE "public"."enum__magazine_issues_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "_article_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar,
  	"version_author" varchar,
  	"version_content" jsonb,
  	"version_youtube_url" varchar,
  	"version_featured_image_id" uuid,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__article_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_events_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_event_type" "enum__events_v_version_event_type",
  	"version_date" timestamp(3) with time zone,
  	"version_location" varchar,
  	"version_description" varchar,
  	"version_excerpt" varchar,
  	"version_youtube_url" varchar,
  	"version_body" jsonb,
  	"version_is_featured" boolean DEFAULT false,
  	"version_is_popular" boolean DEFAULT false,
  	"version_featured_image_id" uuid,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_homily_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_scripture" varchar,
  	"version_category" varchar,
  	"version_featured_image_id" uuid,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_audio_id" uuid,
  	"version_youtube_url" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__homily_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_prayer_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_category" varchar,
  	"version_featured_image_id" uuid,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__prayer_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_music_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_artist" varchar,
  	"version_audio_id" uuid,
  	"version_lyrics" varchar,
  	"version_featured_image_id" uuid,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__music_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_publications_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_price" "enum__publications_v_version_price" DEFAULT 'free',
  	"version_price_amount" numeric,
  	"version_cover_id" uuid,
  	"version_file_id" uuid,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__publications_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_magazine_issues_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_excerpt" varchar,
  	"version_price" "enum__magazine_issues_v_version_price" DEFAULT 'free',
  	"version_price_amount" numeric,
  	"version_cover_id" uuid,
  	"version_file_id" uuid,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__magazine_issues_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  DROP INDEX "media_sizes_square_sizes_square_filename_idx";
  DROP INDEX "media_sizes_small_sizes_small_filename_idx";
  DROP INDEX "media_sizes_medium_sizes_medium_filename_idx";
  DROP INDEX "media_sizes_large_sizes_large_filename_idx";
  DROP INDEX "media_sizes_xlarge_sizes_xlarge_filename_idx";
  ALTER TABLE "article" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "article" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "date" DROP NOT NULL;
  ALTER TABLE "homily" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "homily" ALTER COLUMN "date" DROP NOT NULL;
  ALTER TABLE "homily" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "prayer" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "prayer" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "music" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "music" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "publications" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "publications" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "magazine_issues" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "magazine_issues" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "article" ADD COLUMN "_status" "enum_article_status" DEFAULT 'draft';
  ALTER TABLE "events" ADD COLUMN "_status" "enum_events_status" DEFAULT 'draft';
  ALTER TABLE "homily" ADD COLUMN "_status" "enum_homily_status" DEFAULT 'draft';
  ALTER TABLE "prayer" ADD COLUMN "_status" "enum_prayer_status" DEFAULT 'draft';
  ALTER TABLE "music" ADD COLUMN "_status" "enum_music_status" DEFAULT 'draft';
  ALTER TABLE "publications" ADD COLUMN "_status" "enum_publications_status" DEFAULT 'draft';
  ALTER TABLE "magazine_issues" ADD COLUMN "_status" "enum_magazine_issues_status" DEFAULT 'draft';
  ALTER TABLE "_article_v" ADD CONSTRAINT "_article_v_parent_id_article_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."article"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_article_v" ADD CONSTRAINT "_article_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homily_v" ADD CONSTRAINT "_homily_v_parent_id_homily_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homily"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homily_v" ADD CONSTRAINT "_homily_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homily_v" ADD CONSTRAINT "_homily_v_version_audio_id_media_id_fk" FOREIGN KEY ("version_audio_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_prayer_v" ADD CONSTRAINT "_prayer_v_parent_id_prayer_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."prayer"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_prayer_v" ADD CONSTRAINT "_prayer_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_music_v" ADD CONSTRAINT "_music_v_parent_id_music_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."music"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_music_v" ADD CONSTRAINT "_music_v_version_audio_id_media_id_fk" FOREIGN KEY ("version_audio_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_music_v" ADD CONSTRAINT "_music_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publications_v" ADD CONSTRAINT "_publications_v_parent_id_publications_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."publications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publications_v" ADD CONSTRAINT "_publications_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publications_v" ADD CONSTRAINT "_publications_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_magazine_issues_v" ADD CONSTRAINT "_magazine_issues_v_parent_id_magazine_issues_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."magazine_issues"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_magazine_issues_v" ADD CONSTRAINT "_magazine_issues_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_magazine_issues_v" ADD CONSTRAINT "_magazine_issues_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_article_v_parent_idx" ON "_article_v" USING btree ("parent_id");
  CREATE INDEX "_article_v_version_version_featured_image_idx" ON "_article_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_article_v_version_version_slug_idx" ON "_article_v" USING btree ("version_slug");
  CREATE INDEX "_article_v_version_version_updated_at_idx" ON "_article_v" USING btree ("version_updated_at");
  CREATE INDEX "_article_v_version_version_created_at_idx" ON "_article_v" USING btree ("version_created_at");
  CREATE INDEX "_article_v_version_version__status_idx" ON "_article_v" USING btree ("version__status");
  CREATE INDEX "_article_v_created_at_idx" ON "_article_v" USING btree ("created_at");
  CREATE INDEX "_article_v_updated_at_idx" ON "_article_v" USING btree ("updated_at");
  CREATE INDEX "_article_v_latest_idx" ON "_article_v" USING btree ("latest");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_featured_image_idx" ON "_events_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "_homily_v_parent_idx" ON "_homily_v" USING btree ("parent_id");
  CREATE INDEX "_homily_v_version_version_featured_image_idx" ON "_homily_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_homily_v_version_version_audio_idx" ON "_homily_v" USING btree ("version_audio_id");
  CREATE INDEX "_homily_v_version_version_slug_idx" ON "_homily_v" USING btree ("version_slug");
  CREATE INDEX "_homily_v_version_version_updated_at_idx" ON "_homily_v" USING btree ("version_updated_at");
  CREATE INDEX "_homily_v_version_version_created_at_idx" ON "_homily_v" USING btree ("version_created_at");
  CREATE INDEX "_homily_v_version_version__status_idx" ON "_homily_v" USING btree ("version__status");
  CREATE INDEX "_homily_v_created_at_idx" ON "_homily_v" USING btree ("created_at");
  CREATE INDEX "_homily_v_updated_at_idx" ON "_homily_v" USING btree ("updated_at");
  CREATE INDEX "_homily_v_latest_idx" ON "_homily_v" USING btree ("latest");
  CREATE INDEX "_prayer_v_parent_idx" ON "_prayer_v" USING btree ("parent_id");
  CREATE INDEX "_prayer_v_version_version_slug_idx" ON "_prayer_v" USING btree ("version_slug");
  CREATE INDEX "_prayer_v_version_version_featured_image_idx" ON "_prayer_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_prayer_v_version_version_updated_at_idx" ON "_prayer_v" USING btree ("version_updated_at");
  CREATE INDEX "_prayer_v_version_version_created_at_idx" ON "_prayer_v" USING btree ("version_created_at");
  CREATE INDEX "_prayer_v_version_version__status_idx" ON "_prayer_v" USING btree ("version__status");
  CREATE INDEX "_prayer_v_created_at_idx" ON "_prayer_v" USING btree ("created_at");
  CREATE INDEX "_prayer_v_updated_at_idx" ON "_prayer_v" USING btree ("updated_at");
  CREATE INDEX "_prayer_v_latest_idx" ON "_prayer_v" USING btree ("latest");
  CREATE INDEX "_music_v_parent_idx" ON "_music_v" USING btree ("parent_id");
  CREATE INDEX "_music_v_version_version_slug_idx" ON "_music_v" USING btree ("version_slug");
  CREATE INDEX "_music_v_version_version_audio_idx" ON "_music_v" USING btree ("version_audio_id");
  CREATE INDEX "_music_v_version_version_featured_image_idx" ON "_music_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_music_v_version_version_updated_at_idx" ON "_music_v" USING btree ("version_updated_at");
  CREATE INDEX "_music_v_version_version_created_at_idx" ON "_music_v" USING btree ("version_created_at");
  CREATE INDEX "_music_v_version_version__status_idx" ON "_music_v" USING btree ("version__status");
  CREATE INDEX "_music_v_created_at_idx" ON "_music_v" USING btree ("created_at");
  CREATE INDEX "_music_v_updated_at_idx" ON "_music_v" USING btree ("updated_at");
  CREATE INDEX "_music_v_latest_idx" ON "_music_v" USING btree ("latest");
  CREATE INDEX "_publications_v_parent_idx" ON "_publications_v" USING btree ("parent_id");
  CREATE INDEX "_publications_v_version_version_slug_idx" ON "_publications_v" USING btree ("version_slug");
  CREATE INDEX "_publications_v_version_version_cover_idx" ON "_publications_v" USING btree ("version_cover_id");
  CREATE INDEX "_publications_v_version_version_file_idx" ON "_publications_v" USING btree ("version_file_id");
  CREATE INDEX "_publications_v_version_version_updated_at_idx" ON "_publications_v" USING btree ("version_updated_at");
  CREATE INDEX "_publications_v_version_version_created_at_idx" ON "_publications_v" USING btree ("version_created_at");
  CREATE INDEX "_publications_v_version_version__status_idx" ON "_publications_v" USING btree ("version__status");
  CREATE INDEX "_publications_v_created_at_idx" ON "_publications_v" USING btree ("created_at");
  CREATE INDEX "_publications_v_updated_at_idx" ON "_publications_v" USING btree ("updated_at");
  CREATE INDEX "_publications_v_latest_idx" ON "_publications_v" USING btree ("latest");
  CREATE INDEX "_magazine_issues_v_parent_idx" ON "_magazine_issues_v" USING btree ("parent_id");
  CREATE INDEX "_magazine_issues_v_version_version_slug_idx" ON "_magazine_issues_v" USING btree ("version_slug");
  CREATE INDEX "_magazine_issues_v_version_version_cover_idx" ON "_magazine_issues_v" USING btree ("version_cover_id");
  CREATE INDEX "_magazine_issues_v_version_version_file_idx" ON "_magazine_issues_v" USING btree ("version_file_id");
  CREATE INDEX "_magazine_issues_v_version_version_updated_at_idx" ON "_magazine_issues_v" USING btree ("version_updated_at");
  CREATE INDEX "_magazine_issues_v_version_version_created_at_idx" ON "_magazine_issues_v" USING btree ("version_created_at");
  CREATE INDEX "_magazine_issues_v_version_version__status_idx" ON "_magazine_issues_v" USING btree ("version__status");
  CREATE INDEX "_magazine_issues_v_created_at_idx" ON "_magazine_issues_v" USING btree ("created_at");
  CREATE INDEX "_magazine_issues_v_updated_at_idx" ON "_magazine_issues_v" USING btree ("updated_at");
  CREATE INDEX "_magazine_issues_v_latest_idx" ON "_magazine_issues_v" USING btree ("latest");
  CREATE INDEX "article__status_idx" ON "article" USING btree ("_status");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "homily__status_idx" ON "homily" USING btree ("_status");
  CREATE INDEX "prayer__status_idx" ON "prayer" USING btree ("_status");
  CREATE INDEX "music__status_idx" ON "music" USING btree ("_status");
  CREATE INDEX "publications__status_idx" ON "publications" USING btree ("_status");
  CREATE INDEX "magazine_issues__status_idx" ON "magazine_issues" USING btree ("_status");
  ALTER TABLE "media" DROP COLUMN "sizes_square_url";
  ALTER TABLE "media" DROP COLUMN "sizes_square_width";
  ALTER TABLE "media" DROP COLUMN "sizes_square_height";
  ALTER TABLE "media" DROP COLUMN "sizes_square_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_square_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_square_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_small_url";
  ALTER TABLE "media" DROP COLUMN "sizes_small_width";
  ALTER TABLE "media" DROP COLUMN "sizes_small_height";
  ALTER TABLE "media" DROP COLUMN "sizes_small_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_small_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_small_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_medium_url";
  ALTER TABLE "media" DROP COLUMN "sizes_medium_width";
  ALTER TABLE "media" DROP COLUMN "sizes_medium_height";
  ALTER TABLE "media" DROP COLUMN "sizes_medium_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_medium_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_medium_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_large_url";
  ALTER TABLE "media" DROP COLUMN "sizes_large_width";
  ALTER TABLE "media" DROP COLUMN "sizes_large_height";
  ALTER TABLE "media" DROP COLUMN "sizes_large_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_large_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_large_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_xlarge_url";
  ALTER TABLE "media" DROP COLUMN "sizes_xlarge_width";
  ALTER TABLE "media" DROP COLUMN "sizes_xlarge_height";
  ALTER TABLE "media" DROP COLUMN "sizes_xlarge_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_xlarge_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_xlarge_filename";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_article_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homily_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_prayer_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_music_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_publications_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_magazine_issues_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_article_v" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "_homily_v" CASCADE;
  DROP TABLE "_prayer_v" CASCADE;
  DROP TABLE "_music_v" CASCADE;
  DROP TABLE "_publications_v" CASCADE;
  DROP TABLE "_magazine_issues_v" CASCADE;
  DROP INDEX "article__status_idx";
  DROP INDEX "events__status_idx";
  DROP INDEX "homily__status_idx";
  DROP INDEX "prayer__status_idx";
  DROP INDEX "music__status_idx";
  DROP INDEX "publications__status_idx";
  DROP INDEX "magazine_issues__status_idx";
  ALTER TABLE "article" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "article" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "events" ALTER COLUMN "date" SET NOT NULL;
  ALTER TABLE "homily" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "homily" ALTER COLUMN "date" SET NOT NULL;
  ALTER TABLE "homily" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "prayer" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "prayer" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "music" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "music" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "publications" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "publications" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "magazine_issues" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "magazine_issues" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "media" ADD COLUMN "sizes_square_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_square_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_square_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_square_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_square_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_square_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_small_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_small_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_small_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_small_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_small_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_small_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_medium_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_medium_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_medium_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_medium_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_medium_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_medium_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_large_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_large_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_large_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_large_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_large_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_large_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_xlarge_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_xlarge_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_xlarge_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_xlarge_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_xlarge_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_xlarge_filename" varchar;
  CREATE INDEX "media_sizes_square_sizes_square_filename_idx" ON "media" USING btree ("sizes_square_filename");
  CREATE INDEX "media_sizes_small_sizes_small_filename_idx" ON "media" USING btree ("sizes_small_filename");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_xlarge_sizes_xlarge_filename_idx" ON "media" USING btree ("sizes_xlarge_filename");
  ALTER TABLE "article" DROP COLUMN "_status";
  ALTER TABLE "events" DROP COLUMN "_status";
  ALTER TABLE "homily" DROP COLUMN "_status";
  ALTER TABLE "prayer" DROP COLUMN "_status";
  ALTER TABLE "music" DROP COLUMN "_status";
  ALTER TABLE "publications" DROP COLUMN "_status";
  ALTER TABLE "magazine_issues" DROP COLUMN "_status";
  DROP TYPE "public"."enum_article_status";
  DROP TYPE "public"."enum__article_v_version_status";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_event_type";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_homily_status";
  DROP TYPE "public"."enum__homily_v_version_status";
  DROP TYPE "public"."enum_prayer_status";
  DROP TYPE "public"."enum__prayer_v_version_status";
  DROP TYPE "public"."enum_music_status";
  DROP TYPE "public"."enum__music_v_version_status";
  DROP TYPE "public"."enum_publications_status";
  DROP TYPE "public"."enum__publications_v_version_price";
  DROP TYPE "public"."enum__publications_v_version_status";
  DROP TYPE "public"."enum_magazine_issues_status";
  DROP TYPE "public"."enum__magazine_issues_v_version_price";
  DROP TYPE "public"."enum__magazine_issues_v_version_status";`)
}
