import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_donations_programme" AS ENUM('general', 'young-creators');
  CREATE TYPE "public"."enum_donations_designation" AS ENUM('general', 'mentorship', 'equipment', 'showcase');
  CREATE TYPE "public"."enum_donations_support_frequency" AS ENUM('one-off', 'monthly');
  CREATE TYPE "public"."enum_young_creators_works_type" AS ENUM('Writing', 'Music', 'Artwork', 'Photo series', 'Performance', 'Video', 'Project');
  CREATE TYPE "public"."enum_young_creators_primary_category" AS ENUM('writing', 'music', 'visual-art', 'photography', 'dance', 'digital', 'technology');
  CREATE TYPE "public"."enum_young_creators_name_visibility" AS ENUM('full-name', 'first-name-initial', 'alias');
  CREATE TYPE "public"."enum_young_creators_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__young_creators_v_version_works_type" AS ENUM('Writing', 'Music', 'Artwork', 'Photo series', 'Performance', 'Video', 'Project');
  CREATE TYPE "public"."enum__young_creators_v_version_primary_category" AS ENUM('writing', 'music', 'visual-art', 'photography', 'dance', 'digital', 'technology');
  CREATE TYPE "public"."enum__young_creators_v_version_name_visibility" AS ENUM('full-name', 'first-name-initial', 'alias');
  CREATE TYPE "public"."enum__young_creators_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_ycn_updates_kind" AS ENUM('New work', 'Performance', 'Milestone', 'Feature');
  CREATE TYPE "public"."enum_ycn_updates_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__ycn_updates_v_version_kind" AS ENUM('New work', 'Performance', 'Milestone', 'Feature');
  CREATE TYPE "public"."enum__ycn_updates_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_ycn_mentor_applications_expertise" AS ENUM('writing', 'music', 'visual-art', 'photography', 'dance', 'digital', 'technology');
  CREATE TYPE "public"."enum_ycn_mentor_applications_availability" AS ENUM('weekly', 'fortnightly', 'monthly', 'project');
  CREATE TYPE "public"."enum_ycn_mentor_applications_format" AS ENUM('in-person', 'online', 'either');
  CREATE TYPE "public"."enum_ycn_mentor_applications_status" AS ENUM('new', 'reviewing', 'approved', 'declined');
  CREATE TYPE "public"."enum_ycn_opportunities_categories" AS ENUM('writing', 'music', 'visual-art', 'photography', 'dance', 'digital', 'technology');
  CREATE TYPE "public"."enum_ycn_opportunities_type" AS ENUM('internship', 'commission', 'performance', 'exhibition', 'scholarship', 'workshop', 'other');
  CREATE TYPE "public"."enum_ycn_opportunities_status" AS ENUM('pending-review', 'reviewing', 'approved', 'declined', 'archived');
  CREATE TABLE "young_creators_talents" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "young_creators_bio" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "young_creators_interview" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "young_creators_works" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"type" "enum_young_creators_works_type",
  	"year" numeric,
  	"description" varchar,
  	"image_id" uuid,
  	"href" varchar
  );
  
  CREATE TABLE "young_creators_achievements" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" numeric,
  	"title" varchar,
  	"detail" varchar
  );
  
  CREATE TABLE "young_creators_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" uuid,
  	"caption" varchar
  );
  
  CREATE TABLE "young_creators" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"public_display_name" varchar,
  	"slug" varchar,
  	"portrait_id" uuid,
  	"class_year" numeric,
  	"primary_category" "enum_young_creators_primary_category",
  	"featured" boolean DEFAULT false,
  	"location" varchar,
  	"tagline" varchar,
  	"gifts_and_talents" varchar,
  	"discovery_story" varchar,
  	"video_url" varchar,
  	"video_poster_id" uuid,
  	"published_at" timestamp(3) with time zone,
  	"name_visibility" "enum_young_creators_name_visibility",
  	"legal_name" varchar,
  	"is_minor" boolean DEFAULT false,
  	"guardian_consent_on_file" boolean DEFAULT false,
  	"consent_date" timestamp(3) with time zone,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_young_creators_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_young_creators_v_version_talents" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_young_creators_v_version_bio" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_young_creators_v_version_interview" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_young_creators_v_version_works" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar,
  	"type" "enum__young_creators_v_version_works_type",
  	"year" numeric,
  	"description" varchar,
  	"image_id" uuid,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_young_creators_v_version_achievements" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"year" numeric,
  	"title" varchar,
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_young_creators_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"image_id" uuid,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_young_creators_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_public_display_name" varchar,
  	"version_slug" varchar,
  	"version_portrait_id" uuid,
  	"version_class_year" numeric,
  	"version_primary_category" "enum__young_creators_v_version_primary_category",
  	"version_featured" boolean DEFAULT false,
  	"version_location" varchar,
  	"version_tagline" varchar,
  	"version_gifts_and_talents" varchar,
  	"version_discovery_story" varchar,
  	"version_video_url" varchar,
  	"version_video_poster_id" uuid,
  	"version_published_at" timestamp(3) with time zone,
  	"version_name_visibility" "enum__young_creators_v_version_name_visibility",
  	"version_legal_name" varchar,
  	"version_is_minor" boolean DEFAULT false,
  	"version_guardian_consent_on_file" boolean DEFAULT false,
  	"version_consent_date" timestamp(3) with time zone,
  	"version_internal_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__young_creators_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "ycn_updates" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar,
  	"creator_id" uuid,
  	"kind" "enum_ycn_updates_kind" DEFAULT 'New work',
  	"date" timestamp(3) with time zone,
  	"excerpt" varchar,
  	"image_id" uuid,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_ycn_updates_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_ycn_updates_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar,
  	"version_creator_id" uuid,
  	"version_kind" "enum__ycn_updates_v_version_kind" DEFAULT 'New work',
  	"version_date" timestamp(3) with time zone,
  	"version_excerpt" varchar,
  	"version_image_id" uuid,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__ycn_updates_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "ycn_mentor_applications_expertise" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "enum_ycn_mentor_applications_expertise",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE "ycn_mentor_applications" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"organisation" varchar,
  	"experience" varchar NOT NULL,
  	"availability" "enum_ycn_mentor_applications_availability" DEFAULT 'monthly' NOT NULL,
  	"format" "enum_ycn_mentor_applications_format" DEFAULT 'either' NOT NULL,
  	"safeguarding_consent" boolean DEFAULT false NOT NULL,
  	"status" "enum_ycn_mentor_applications_status" DEFAULT 'new' NOT NULL,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ycn_opportunities_categories" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "enum_ycn_opportunities_categories",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE "ycn_opportunities" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"contact_name" varchar NOT NULL,
  	"organisation" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"type" "enum_ycn_opportunities_type" NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"location" varchar NOT NULL,
  	"deadline" timestamp(3) with time zone,
  	"safeguarding_consent" boolean DEFAULT false NOT NULL,
  	"status" "enum_ycn_opportunities_status" DEFAULT 'pending-review' NOT NULL,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ycn_settings_impact_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "ycn_settings" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"hero_image_id" uuid,
  	"workshop_image_id" uuid,
  	"contact_label" varchar DEFAULT 'Contact the Young Creators Team',
  	"contact_href" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "donations" ADD COLUMN "programme" "enum_donations_programme" DEFAULT 'general';
  ALTER TABLE "donations" ADD COLUMN "designation" "enum_donations_designation";
  ALTER TABLE "donations" ADD COLUMN "support_frequency" "enum_donations_support_frequency";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "young_creators_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "ycn_updates_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "ycn_mentor_applications_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "ycn_opportunities_id" uuid;
  ALTER TABLE "young_creators_talents" ADD CONSTRAINT "young_creators_talents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."young_creators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "young_creators_bio" ADD CONSTRAINT "young_creators_bio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."young_creators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "young_creators_interview" ADD CONSTRAINT "young_creators_interview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."young_creators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "young_creators_works" ADD CONSTRAINT "young_creators_works_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "young_creators_works" ADD CONSTRAINT "young_creators_works_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."young_creators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "young_creators_achievements" ADD CONSTRAINT "young_creators_achievements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."young_creators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "young_creators_gallery" ADD CONSTRAINT "young_creators_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "young_creators_gallery" ADD CONSTRAINT "young_creators_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."young_creators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "young_creators" ADD CONSTRAINT "young_creators_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "young_creators" ADD CONSTRAINT "young_creators_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_young_creators_v_version_talents" ADD CONSTRAINT "_young_creators_v_version_talents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_young_creators_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_young_creators_v_version_bio" ADD CONSTRAINT "_young_creators_v_version_bio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_young_creators_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_young_creators_v_version_interview" ADD CONSTRAINT "_young_creators_v_version_interview_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_young_creators_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_young_creators_v_version_works" ADD CONSTRAINT "_young_creators_v_version_works_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_young_creators_v_version_works" ADD CONSTRAINT "_young_creators_v_version_works_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_young_creators_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_young_creators_v_version_achievements" ADD CONSTRAINT "_young_creators_v_version_achievements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_young_creators_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_young_creators_v_version_gallery" ADD CONSTRAINT "_young_creators_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_young_creators_v_version_gallery" ADD CONSTRAINT "_young_creators_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_young_creators_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_young_creators_v" ADD CONSTRAINT "_young_creators_v_parent_id_young_creators_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."young_creators"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_young_creators_v" ADD CONSTRAINT "_young_creators_v_version_portrait_id_media_id_fk" FOREIGN KEY ("version_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_young_creators_v" ADD CONSTRAINT "_young_creators_v_version_video_poster_id_media_id_fk" FOREIGN KEY ("version_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ycn_updates" ADD CONSTRAINT "ycn_updates_creator_id_young_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."young_creators"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ycn_updates" ADD CONSTRAINT "ycn_updates_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ycn_updates_v" ADD CONSTRAINT "_ycn_updates_v_parent_id_ycn_updates_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ycn_updates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ycn_updates_v" ADD CONSTRAINT "_ycn_updates_v_version_creator_id_young_creators_id_fk" FOREIGN KEY ("version_creator_id") REFERENCES "public"."young_creators"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_ycn_updates_v" ADD CONSTRAINT "_ycn_updates_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ycn_mentor_applications_expertise" ADD CONSTRAINT "ycn_mentor_applications_expertise_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ycn_mentor_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ycn_opportunities_categories" ADD CONSTRAINT "ycn_opportunities_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ycn_opportunities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ycn_settings_impact_stats" ADD CONSTRAINT "ycn_settings_impact_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ycn_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ycn_settings" ADD CONSTRAINT "ycn_settings_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ycn_settings" ADD CONSTRAINT "ycn_settings_workshop_image_id_media_id_fk" FOREIGN KEY ("workshop_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "young_creators_talents_order_idx" ON "young_creators_talents" USING btree ("_order");
  CREATE INDEX "young_creators_talents_parent_id_idx" ON "young_creators_talents" USING btree ("_parent_id");
  CREATE INDEX "young_creators_bio_order_idx" ON "young_creators_bio" USING btree ("_order");
  CREATE INDEX "young_creators_bio_parent_id_idx" ON "young_creators_bio" USING btree ("_parent_id");
  CREATE INDEX "young_creators_interview_order_idx" ON "young_creators_interview" USING btree ("_order");
  CREATE INDEX "young_creators_interview_parent_id_idx" ON "young_creators_interview" USING btree ("_parent_id");
  CREATE INDEX "young_creators_works_order_idx" ON "young_creators_works" USING btree ("_order");
  CREATE INDEX "young_creators_works_parent_id_idx" ON "young_creators_works" USING btree ("_parent_id");
  CREATE INDEX "young_creators_works_image_idx" ON "young_creators_works" USING btree ("image_id");
  CREATE INDEX "young_creators_achievements_order_idx" ON "young_creators_achievements" USING btree ("_order");
  CREATE INDEX "young_creators_achievements_parent_id_idx" ON "young_creators_achievements" USING btree ("_parent_id");
  CREATE INDEX "young_creators_gallery_order_idx" ON "young_creators_gallery" USING btree ("_order");
  CREATE INDEX "young_creators_gallery_parent_id_idx" ON "young_creators_gallery" USING btree ("_parent_id");
  CREATE INDEX "young_creators_gallery_image_idx" ON "young_creators_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "young_creators_slug_idx" ON "young_creators" USING btree ("slug");
  CREATE INDEX "young_creators_portrait_idx" ON "young_creators" USING btree ("portrait_id");
  CREATE INDEX "young_creators_video_poster_idx" ON "young_creators" USING btree ("video_poster_id");
  CREATE INDEX "young_creators_updated_at_idx" ON "young_creators" USING btree ("updated_at");
  CREATE INDEX "young_creators_created_at_idx" ON "young_creators" USING btree ("created_at");
  CREATE INDEX "young_creators__status_idx" ON "young_creators" USING btree ("_status");
  CREATE INDEX "_young_creators_v_version_talents_order_idx" ON "_young_creators_v_version_talents" USING btree ("_order");
  CREATE INDEX "_young_creators_v_version_talents_parent_id_idx" ON "_young_creators_v_version_talents" USING btree ("_parent_id");
  CREATE INDEX "_young_creators_v_version_bio_order_idx" ON "_young_creators_v_version_bio" USING btree ("_order");
  CREATE INDEX "_young_creators_v_version_bio_parent_id_idx" ON "_young_creators_v_version_bio" USING btree ("_parent_id");
  CREATE INDEX "_young_creators_v_version_interview_order_idx" ON "_young_creators_v_version_interview" USING btree ("_order");
  CREATE INDEX "_young_creators_v_version_interview_parent_id_idx" ON "_young_creators_v_version_interview" USING btree ("_parent_id");
  CREATE INDEX "_young_creators_v_version_works_order_idx" ON "_young_creators_v_version_works" USING btree ("_order");
  CREATE INDEX "_young_creators_v_version_works_parent_id_idx" ON "_young_creators_v_version_works" USING btree ("_parent_id");
  CREATE INDEX "_young_creators_v_version_works_image_idx" ON "_young_creators_v_version_works" USING btree ("image_id");
  CREATE INDEX "_young_creators_v_version_achievements_order_idx" ON "_young_creators_v_version_achievements" USING btree ("_order");
  CREATE INDEX "_young_creators_v_version_achievements_parent_id_idx" ON "_young_creators_v_version_achievements" USING btree ("_parent_id");
  CREATE INDEX "_young_creators_v_version_gallery_order_idx" ON "_young_creators_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_young_creators_v_version_gallery_parent_id_idx" ON "_young_creators_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_young_creators_v_version_gallery_image_idx" ON "_young_creators_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_young_creators_v_parent_idx" ON "_young_creators_v" USING btree ("parent_id");
  CREATE INDEX "_young_creators_v_version_version_slug_idx" ON "_young_creators_v" USING btree ("version_slug");
  CREATE INDEX "_young_creators_v_version_version_portrait_idx" ON "_young_creators_v" USING btree ("version_portrait_id");
  CREATE INDEX "_young_creators_v_version_version_video_poster_idx" ON "_young_creators_v" USING btree ("version_video_poster_id");
  CREATE INDEX "_young_creators_v_version_version_updated_at_idx" ON "_young_creators_v" USING btree ("version_updated_at");
  CREATE INDEX "_young_creators_v_version_version_created_at_idx" ON "_young_creators_v" USING btree ("version_created_at");
  CREATE INDEX "_young_creators_v_version_version__status_idx" ON "_young_creators_v" USING btree ("version__status");
  CREATE INDEX "_young_creators_v_created_at_idx" ON "_young_creators_v" USING btree ("created_at");
  CREATE INDEX "_young_creators_v_updated_at_idx" ON "_young_creators_v" USING btree ("updated_at");
  CREATE INDEX "_young_creators_v_latest_idx" ON "_young_creators_v" USING btree ("latest");
  CREATE INDEX "ycn_updates_creator_idx" ON "ycn_updates" USING btree ("creator_id");
  CREATE INDEX "ycn_updates_image_idx" ON "ycn_updates" USING btree ("image_id");
  CREATE INDEX "ycn_updates_updated_at_idx" ON "ycn_updates" USING btree ("updated_at");
  CREATE INDEX "ycn_updates_created_at_idx" ON "ycn_updates" USING btree ("created_at");
  CREATE INDEX "ycn_updates__status_idx" ON "ycn_updates" USING btree ("_status");
  CREATE INDEX "_ycn_updates_v_parent_idx" ON "_ycn_updates_v" USING btree ("parent_id");
  CREATE INDEX "_ycn_updates_v_version_version_creator_idx" ON "_ycn_updates_v" USING btree ("version_creator_id");
  CREATE INDEX "_ycn_updates_v_version_version_image_idx" ON "_ycn_updates_v" USING btree ("version_image_id");
  CREATE INDEX "_ycn_updates_v_version_version_updated_at_idx" ON "_ycn_updates_v" USING btree ("version_updated_at");
  CREATE INDEX "_ycn_updates_v_version_version_created_at_idx" ON "_ycn_updates_v" USING btree ("version_created_at");
  CREATE INDEX "_ycn_updates_v_version_version__status_idx" ON "_ycn_updates_v" USING btree ("version__status");
  CREATE INDEX "_ycn_updates_v_created_at_idx" ON "_ycn_updates_v" USING btree ("created_at");
  CREATE INDEX "_ycn_updates_v_updated_at_idx" ON "_ycn_updates_v" USING btree ("updated_at");
  CREATE INDEX "_ycn_updates_v_latest_idx" ON "_ycn_updates_v" USING btree ("latest");
  CREATE INDEX "ycn_mentor_applications_expertise_order_idx" ON "ycn_mentor_applications_expertise" USING btree ("order");
  CREATE INDEX "ycn_mentor_applications_expertise_parent_idx" ON "ycn_mentor_applications_expertise" USING btree ("parent_id");
  CREATE INDEX "ycn_mentor_applications_updated_at_idx" ON "ycn_mentor_applications" USING btree ("updated_at");
  CREATE INDEX "ycn_mentor_applications_created_at_idx" ON "ycn_mentor_applications" USING btree ("created_at");
  CREATE INDEX "ycn_opportunities_categories_order_idx" ON "ycn_opportunities_categories" USING btree ("order");
  CREATE INDEX "ycn_opportunities_categories_parent_idx" ON "ycn_opportunities_categories" USING btree ("parent_id");
  CREATE INDEX "ycn_opportunities_updated_at_idx" ON "ycn_opportunities" USING btree ("updated_at");
  CREATE INDEX "ycn_opportunities_created_at_idx" ON "ycn_opportunities" USING btree ("created_at");
  CREATE INDEX "ycn_settings_impact_stats_order_idx" ON "ycn_settings_impact_stats" USING btree ("_order");
  CREATE INDEX "ycn_settings_impact_stats_parent_id_idx" ON "ycn_settings_impact_stats" USING btree ("_parent_id");
  CREATE INDEX "ycn_settings_hero_image_idx" ON "ycn_settings" USING btree ("hero_image_id");
  CREATE INDEX "ycn_settings_workshop_image_idx" ON "ycn_settings" USING btree ("workshop_image_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_young_creators_fk" FOREIGN KEY ("young_creators_id") REFERENCES "public"."young_creators"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ycn_updates_fk" FOREIGN KEY ("ycn_updates_id") REFERENCES "public"."ycn_updates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ycn_mentor_applications_fk" FOREIGN KEY ("ycn_mentor_applications_id") REFERENCES "public"."ycn_mentor_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ycn_opportunities_fk" FOREIGN KEY ("ycn_opportunities_id") REFERENCES "public"."ycn_opportunities"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_young_creators_id_idx" ON "payload_locked_documents_rels" USING btree ("young_creators_id");
  CREATE INDEX "payload_locked_documents_rels_ycn_updates_id_idx" ON "payload_locked_documents_rels" USING btree ("ycn_updates_id");
  CREATE INDEX "payload_locked_documents_rels_ycn_mentor_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("ycn_mentor_applications_id");
  CREATE INDEX "payload_locked_documents_rels_ycn_opportunities_id_idx" ON "payload_locked_documents_rels" USING btree ("ycn_opportunities_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "young_creators_talents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "young_creators_bio" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "young_creators_interview" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "young_creators_works" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "young_creators_achievements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "young_creators_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "young_creators" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_young_creators_v_version_talents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_young_creators_v_version_bio" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_young_creators_v_version_interview" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_young_creators_v_version_works" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_young_creators_v_version_achievements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_young_creators_v_version_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_young_creators_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ycn_updates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_ycn_updates_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ycn_mentor_applications_expertise" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ycn_mentor_applications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ycn_opportunities_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ycn_opportunities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ycn_settings_impact_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ycn_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "young_creators_talents" CASCADE;
  DROP TABLE "young_creators_bio" CASCADE;
  DROP TABLE "young_creators_interview" CASCADE;
  DROP TABLE "young_creators_works" CASCADE;
  DROP TABLE "young_creators_achievements" CASCADE;
  DROP TABLE "young_creators_gallery" CASCADE;
  DROP TABLE "young_creators" CASCADE;
  DROP TABLE "_young_creators_v_version_talents" CASCADE;
  DROP TABLE "_young_creators_v_version_bio" CASCADE;
  DROP TABLE "_young_creators_v_version_interview" CASCADE;
  DROP TABLE "_young_creators_v_version_works" CASCADE;
  DROP TABLE "_young_creators_v_version_achievements" CASCADE;
  DROP TABLE "_young_creators_v_version_gallery" CASCADE;
  DROP TABLE "_young_creators_v" CASCADE;
  DROP TABLE "ycn_updates" CASCADE;
  DROP TABLE "_ycn_updates_v" CASCADE;
  DROP TABLE "ycn_mentor_applications_expertise" CASCADE;
  DROP TABLE "ycn_mentor_applications" CASCADE;
  DROP TABLE "ycn_opportunities_categories" CASCADE;
  DROP TABLE "ycn_opportunities" CASCADE;
  DROP TABLE "ycn_settings_impact_stats" CASCADE;
  DROP TABLE "ycn_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_young_creators_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_ycn_updates_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_ycn_mentor_applications_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_ycn_opportunities_fk";
  
  DROP INDEX "payload_locked_documents_rels_young_creators_id_idx";
  DROP INDEX "payload_locked_documents_rels_ycn_updates_id_idx";
  DROP INDEX "payload_locked_documents_rels_ycn_mentor_applications_id_idx";
  DROP INDEX "payload_locked_documents_rels_ycn_opportunities_id_idx";
  ALTER TABLE "donations" DROP COLUMN "programme";
  ALTER TABLE "donations" DROP COLUMN "designation";
  ALTER TABLE "donations" DROP COLUMN "support_frequency";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "young_creators_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "ycn_updates_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "ycn_mentor_applications_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "ycn_opportunities_id";
  DROP TYPE "public"."enum_donations_programme";
  DROP TYPE "public"."enum_donations_designation";
  DROP TYPE "public"."enum_donations_support_frequency";
  DROP TYPE "public"."enum_young_creators_works_type";
  DROP TYPE "public"."enum_young_creators_primary_category";
  DROP TYPE "public"."enum_young_creators_name_visibility";
  DROP TYPE "public"."enum_young_creators_status";
  DROP TYPE "public"."enum__young_creators_v_version_works_type";
  DROP TYPE "public"."enum__young_creators_v_version_primary_category";
  DROP TYPE "public"."enum__young_creators_v_version_name_visibility";
  DROP TYPE "public"."enum__young_creators_v_version_status";
  DROP TYPE "public"."enum_ycn_updates_kind";
  DROP TYPE "public"."enum_ycn_updates_status";
  DROP TYPE "public"."enum__ycn_updates_v_version_kind";
  DROP TYPE "public"."enum__ycn_updates_v_version_status";
  DROP TYPE "public"."enum_ycn_mentor_applications_expertise";
  DROP TYPE "public"."enum_ycn_mentor_applications_availability";
  DROP TYPE "public"."enum_ycn_mentor_applications_format";
  DROP TYPE "public"."enum_ycn_mentor_applications_status";
  DROP TYPE "public"."enum_ycn_opportunities_categories";
  DROP TYPE "public"."enum_ycn_opportunities_type";
  DROP TYPE "public"."enum_ycn_opportunities_status";`)
}
