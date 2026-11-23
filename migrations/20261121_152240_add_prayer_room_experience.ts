import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_prayer_requests_privacy" AS ENUM('public', 'partners', 'private');
  CREATE TYPE "public"."enum_prayer_videos_type" AS ENUM('prayer', 'worship', 'rosary', 'novena', 'scripture', 'holy-spirit', 'reflection');
  CREATE TYPE "public"."enum_prayer_testimonies_status" AS ENUM('pending', 'published', 'archived');
  CREATE TYPE "public"."enum_prayer_partner_requests_areas" AS ENUM('family', 'healing', 'marriage', 'children', 'work', 'exams', 'discernment', 'bereavement', 'peace', 'forgiveness', 'protection', 'spiritual-growth', 'difficult-situations', 'thanksgiving', 'general-intention');
  CREATE TYPE "public"."enum_prayer_partner_requests_kind" AS ENUM('request', 'application');
  CREATE TYPE "public"."enum_prayer_partner_requests_category" AS ENUM('family', 'healing', 'marriage', 'children', 'work', 'exams', 'discernment', 'bereavement', 'peace', 'forgiveness', 'protection', 'spiritual-growth', 'difficult-situations', 'thanksgiving', 'general-intention');
  CREATE TYPE "public"."enum_prayer_partner_requests_support_type" AS ENUM('one-time', 'ongoing');
  CREATE TYPE "public"."enum_prayer_partner_requests_duration" AS ENUM('1-week', '2-weeks', '1-month', 'ongoing');
  CREATE TYPE "public"."enum_prayer_partner_requests_availability" AS ENUM('mornings', 'evenings', 'weekends', 'flexible');
  CREATE TYPE "public"."enum_prayer_partner_requests_frequency" AS ENUM('daily', 'few-times-week', 'weekly');
  CREATE TYPE "public"."enum_prayer_partner_requests_privacy" AS ENUM('first-name', 'anonymous');
  CREATE TYPE "public"."enum_prayer_partner_requests_status" AS ENUM('new', 'review', 'active', 'declined');
  CREATE TYPE "public"."enum_prayer_activities_type" AS ENUM('pray', 'candle');
  CREATE TABLE "prayer_videos" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"youtube_id" varchar NOT NULL,
  	"description" varchar,
  	"type" "enum_prayer_videos_type" DEFAULT 'prayer' NOT NULL,
  	"duration" varchar DEFAULT '20 min',
  	"is_featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "prayer_testimonies" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"text" varchar NOT NULL,
  	"related_intention" varchar,
  	"consent_to_publish" boolean DEFAULT false,
  	"status" "enum_prayer_testimonies_status" DEFAULT 'pending' NOT NULL,
  	"admin_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "prayer_partner_requests_areas" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "enum_prayer_partner_requests_areas",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE "prayer_partner_requests" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"kind" "enum_prayer_partner_requests_kind" DEFAULT 'request' NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"location" varchar,
  	"category" "enum_prayer_partner_requests_category",
  	"message" varchar,
  	"support_type" "enum_prayer_partner_requests_support_type",
  	"duration" "enum_prayer_partner_requests_duration",
  	"availability" "enum_prayer_partner_requests_availability",
  	"frequency" "enum_prayer_partner_requests_frequency",
  	"privacy" "enum_prayer_partner_requests_privacy",
  	"receive_messages" boolean DEFAULT false,
  	"confidentiality_agreed" boolean DEFAULT false,
  	"safeguarding_agreed" boolean DEFAULT false,
  	"status" "enum_prayer_partner_requests_status" DEFAULT 'new' NOT NULL,
  	"admin_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "prayer_activities" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"type" "enum_prayer_activities_type" NOT NULL,
  	"intention_id" uuid NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "prayer_requests" ALTER COLUMN "category" SET DATA TYPE text;
  ALTER TABLE "prayer_requests" ALTER COLUMN "category" SET DEFAULT 'general-intention'::text;
  DROP TYPE "public"."enum_prayer_requests_category";
  CREATE TYPE "public"."enum_prayer_requests_category" AS ENUM('family', 'healing', 'marriage', 'children', 'work', 'exams', 'discernment', 'bereavement', 'peace', 'forgiveness', 'protection', 'spiritual-growth', 'difficult-situations', 'thanksgiving', 'general-intention', 'vocation', 'grief', 'other');
  ALTER TABLE "prayer_requests" ALTER COLUMN "category" SET DEFAULT 'general-intention'::"public"."enum_prayer_requests_category";
  ALTER TABLE "prayer_requests" ALTER COLUMN "category" SET DATA TYPE "public"."enum_prayer_requests_category" USING "category"::"public"."enum_prayer_requests_category";
  ALTER TABLE "prayer_room_settings" ALTER COLUMN "eyebrow" SET DEFAULT 'Spiritans Sound Outreach';
  ALTER TABLE "prayer_room_settings" ALTER COLUMN "title" SET DEFAULT 'Spiritans Sound Prayer Room';
  ALTER TABLE "prayer_room_settings" ALTER COLUMN "description" SET DEFAULT 'A place to pray. A place to be prayed for. A community united in prayer.';
  ALTER TABLE "prayer_requests" ADD COLUMN "privacy" "enum_prayer_requests_privacy" DEFAULT 'public' NOT NULL;
  ALTER TABLE "prayer_requests" ADD COLUMN "prayed_count" numeric DEFAULT 0;
  ALTER TABLE "prayer_requests" ADD COLUMN "candle_count" numeric DEFAULT 0;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "prayer_videos_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "prayer_testimonies_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "prayer_partner_requests_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "prayer_activities_id" uuid;
  ALTER TABLE "prayer_room_settings" ADD COLUMN "hero_quote" varchar DEFAULT '“Whatever brought you here, you do not have to carry it alone. Leave your intention, pray for someone, or simply spend a moment with God.”';
  ALTER TABLE "prayer_partner_requests_areas" ADD CONSTRAINT "prayer_partner_requests_areas_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."prayer_partner_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prayer_activities" ADD CONSTRAINT "prayer_activities_intention_id_prayer_requests_id_fk" FOREIGN KEY ("intention_id") REFERENCES "public"."prayer_requests"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "prayer_videos_updated_at_idx" ON "prayer_videos" USING btree ("updated_at");
  CREATE INDEX "prayer_videos_created_at_idx" ON "prayer_videos" USING btree ("created_at");
  CREATE INDEX "prayer_testimonies_updated_at_idx" ON "prayer_testimonies" USING btree ("updated_at");
  CREATE INDEX "prayer_testimonies_created_at_idx" ON "prayer_testimonies" USING btree ("created_at");
  CREATE INDEX "prayer_partner_requests_areas_order_idx" ON "prayer_partner_requests_areas" USING btree ("order");
  CREATE INDEX "prayer_partner_requests_areas_parent_idx" ON "prayer_partner_requests_areas" USING btree ("parent_id");
  CREATE INDEX "prayer_partner_requests_updated_at_idx" ON "prayer_partner_requests" USING btree ("updated_at");
  CREATE INDEX "prayer_partner_requests_created_at_idx" ON "prayer_partner_requests" USING btree ("created_at");
  CREATE INDEX "prayer_activities_intention_idx" ON "prayer_activities" USING btree ("intention_id");
  CREATE INDEX "prayer_activities_updated_at_idx" ON "prayer_activities" USING btree ("updated_at");
  CREATE INDEX "prayer_activities_created_at_idx" ON "prayer_activities" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_prayer_videos_fk" FOREIGN KEY ("prayer_videos_id") REFERENCES "public"."prayer_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_prayer_testimonies_fk" FOREIGN KEY ("prayer_testimonies_id") REFERENCES "public"."prayer_testimonies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_prayer_partner_requests_fk" FOREIGN KEY ("prayer_partner_requests_id") REFERENCES "public"."prayer_partner_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_prayer_activities_fk" FOREIGN KEY ("prayer_activities_id") REFERENCES "public"."prayer_activities"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_prayer_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("prayer_videos_id");
  CREATE INDEX "payload_locked_documents_rels_prayer_testimonies_id_idx" ON "payload_locked_documents_rels" USING btree ("prayer_testimonies_id");
  CREATE INDEX "payload_locked_documents_rels_prayer_partner_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("prayer_partner_requests_id");
  CREATE INDEX "payload_locked_documents_rels_prayer_activities_id_idx" ON "payload_locked_documents_rels" USING btree ("prayer_activities_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "prayer_videos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "prayer_testimonies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "prayer_partner_requests_areas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "prayer_partner_requests" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "prayer_activities" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "prayer_videos" CASCADE;
  DROP TABLE "prayer_testimonies" CASCADE;
  DROP TABLE "prayer_partner_requests_areas" CASCADE;
  DROP TABLE "prayer_partner_requests" CASCADE;
  DROP TABLE "prayer_activities" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_prayer_videos_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_prayer_testimonies_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_prayer_partner_requests_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_prayer_activities_fk";
  
  ALTER TABLE "prayer_requests" ALTER COLUMN "category" SET DATA TYPE text;
  ALTER TABLE "prayer_requests" ALTER COLUMN "category" SET DEFAULT 'other'::text;
  DROP TYPE "public"."enum_prayer_requests_category";
  CREATE TYPE "public"."enum_prayer_requests_category" AS ENUM('healing', 'family', 'vocation', 'grief', 'thanksgiving', 'other');
  ALTER TABLE "prayer_requests" ALTER COLUMN "category" SET DEFAULT 'other'::"public"."enum_prayer_requests_category";
  ALTER TABLE "prayer_requests" ALTER COLUMN "category" SET DATA TYPE "public"."enum_prayer_requests_category" USING "category"::"public"."enum_prayer_requests_category";
  DROP INDEX "payload_locked_documents_rels_prayer_videos_id_idx";
  DROP INDEX "payload_locked_documents_rels_prayer_testimonies_id_idx";
  DROP INDEX "payload_locked_documents_rels_prayer_partner_requests_id_idx";
  DROP INDEX "payload_locked_documents_rels_prayer_activities_id_idx";
  ALTER TABLE "prayer_room_settings" ALTER COLUMN "eyebrow" SET DEFAULT 'The Prayer Room';
  ALTER TABLE "prayer_room_settings" ALTER COLUMN "title" SET DEFAULT 'Come and rest in the presence of God.';
  ALTER TABLE "prayer_room_settings" ALTER COLUMN "description" SET DEFAULT 'A quiet place to pray, to be prayed for, and to stand with others. Join a live prayer session or leave an intention for our prayer team.';
  ALTER TABLE "prayer_requests" DROP COLUMN "privacy";
  ALTER TABLE "prayer_requests" DROP COLUMN "prayed_count";
  ALTER TABLE "prayer_requests" DROP COLUMN "candle_count";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "prayer_videos_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "prayer_testimonies_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "prayer_partner_requests_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "prayer_activities_id";
  ALTER TABLE "prayer_room_settings" DROP COLUMN "hero_quote";
  DROP TYPE "public"."enum_prayer_requests_privacy";
  DROP TYPE "public"."enum_prayer_videos_type";
  DROP TYPE "public"."enum_prayer_testimonies_status";
  DROP TYPE "public"."enum_prayer_partner_requests_areas";
  DROP TYPE "public"."enum_prayer_partner_requests_kind";
  DROP TYPE "public"."enum_prayer_partner_requests_category";
  DROP TYPE "public"."enum_prayer_partner_requests_support_type";
  DROP TYPE "public"."enum_prayer_partner_requests_duration";
  DROP TYPE "public"."enum_prayer_partner_requests_availability";
  DROP TYPE "public"."enum_prayer_partner_requests_frequency";
  DROP TYPE "public"."enum_prayer_partner_requests_privacy";
  DROP TYPE "public"."enum_prayer_partner_requests_status";
  DROP TYPE "public"."enum_prayer_activities_type";`)
}
