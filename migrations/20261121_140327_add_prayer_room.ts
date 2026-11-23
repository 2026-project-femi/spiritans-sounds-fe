import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_prayer_rooms_day_of_week" AS ENUM('daily', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');
  CREATE TYPE "public"."enum_prayer_rooms_platform" AS ENUM('zoom', 'google-meet', 'youtube', 'in-person', 'other');
  CREATE TYPE "public"."enum_prayer_requests_category" AS ENUM('healing', 'family', 'vocation', 'grief', 'thanksgiving', 'other');
  CREATE TYPE "public"."enum_prayer_requests_status" AS ENUM('pending', 'approved', 'archived');
  CREATE TYPE "public"."enum_prayer_room_settings_meeting_platform" AS ENUM('zoom', 'google-meet', 'youtube', 'in-person', 'other');
  CREATE TABLE "prayer_rooms" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"focus" varchar,
  	"day_of_week" "enum_prayer_rooms_day_of_week" DEFAULT 'wednesday' NOT NULL,
  	"start_time" varchar DEFAULT '8:00 PM' NOT NULL,
  	"timezone" varchar DEFAULT 'WAT',
  	"duration_minutes" numeric DEFAULT 60,
  	"host" varchar,
  	"platform" "enum_prayer_rooms_platform" DEFAULT 'zoom' NOT NULL,
  	"is_live" boolean DEFAULT false,
  	"is_featured" boolean DEFAULT false,
  	"meeting_url" varchar,
  	"location" varchar,
  	"image_id" uuid,
  	"is_active" boolean DEFAULT true,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "prayer_requests" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"category" "enum_prayer_requests_category" DEFAULT 'other' NOT NULL,
  	"intention" varchar NOT NULL,
  	"is_anonymous" boolean DEFAULT false,
  	"consent_to_publish" boolean DEFAULT false,
  	"status" "enum_prayer_requests_status" DEFAULT 'pending' NOT NULL,
  	"admin_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "prayer_room_settings_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "prayer_room_settings" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"eyebrow" varchar DEFAULT 'The Prayer Room',
  	"title" varchar DEFAULT 'Come and rest in the presence of God.' NOT NULL,
  	"description" varchar DEFAULT 'A quiet place to pray, to be prayed for, and to stand with others. Join a live prayer session or leave an intention for our prayer team.',
  	"hero_image_id" uuid,
  	"is_live" boolean DEFAULT false,
  	"meeting_platform" "enum_prayer_room_settings_meeting_platform" DEFAULT 'zoom',
  	"meeting_url" varchar,
  	"live_title" varchar DEFAULT 'The room is open',
  	"live_description" varchar DEFAULT 'Come as you are. You can join with your camera off, and prayer requests can be shared in the chat.',
  	"live_note" varchar,
  	"schedule_eyebrow" varchar DEFAULT 'Gather with us',
  	"schedule_title" varchar DEFAULT 'Weekly prayer rhythms',
  	"schedule_intro" varchar DEFAULT 'Every room is hosted by a member of the prayer team. Come for one session or make one of them a weekly habit.',
  	"show_intentions" boolean DEFAULT true,
  	"intentions_eyebrow" varchar DEFAULT 'Stand with one another',
  	"intentions_title" varchar DEFAULT 'Prayer intentions',
  	"intentions_intro" varchar DEFAULT 'These are prayers left by people like you. Our team prays over every request we receive.',
  	"intentions_privacy_note" varchar DEFAULT 'Contact details are never published. You can share anonymously, and you choose whether your intention may appear on this wall.',
  	"request_form_title" varchar DEFAULT 'Submit a prayer request',
  	"request_form_intro" varchar DEFAULT 'Tell us how we can pray with you. Nothing is too small, and you do not need to use your real name.',
  	"request_success_message" varchar DEFAULT 'Thank you. Your intention has been received, and our prayer team will stand with you.',
  	"resources_eyebrow" varchar DEFAULT 'Pray',
  	"resources_title" varchar DEFAULT 'Prayers to carry with you',
  	"resources_intro" varchar DEFAULT 'Short prayers and devotionals for the moments when you cannot find the words.',
  	"scripture_quote" varchar DEFAULT 'Come to me, all you who are weary and burdened, and I will give you rest.',
  	"scripture_reference" varchar DEFAULT 'Matthew 11:28',
  	"contact_label" varchar DEFAULT 'Contact the prayer team',
  	"contact_href" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "prayer_rooms_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "prayer_requests_id" uuid;
  ALTER TABLE "prayer_rooms" ADD CONSTRAINT "prayer_rooms_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "prayer_room_settings_faq" ADD CONSTRAINT "prayer_room_settings_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prayer_room_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prayer_room_settings" ADD CONSTRAINT "prayer_room_settings_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "prayer_rooms_image_idx" ON "prayer_rooms" USING btree ("image_id");
  CREATE INDEX "prayer_rooms_updated_at_idx" ON "prayer_rooms" USING btree ("updated_at");
  CREATE INDEX "prayer_rooms_created_at_idx" ON "prayer_rooms" USING btree ("created_at");
  CREATE INDEX "prayer_requests_updated_at_idx" ON "prayer_requests" USING btree ("updated_at");
  CREATE INDEX "prayer_requests_created_at_idx" ON "prayer_requests" USING btree ("created_at");
  CREATE INDEX "prayer_room_settings_faq_order_idx" ON "prayer_room_settings_faq" USING btree ("_order");
  CREATE INDEX "prayer_room_settings_faq_parent_id_idx" ON "prayer_room_settings_faq" USING btree ("_parent_id");
  CREATE INDEX "prayer_room_settings_hero_image_idx" ON "prayer_room_settings" USING btree ("hero_image_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_prayer_rooms_fk" FOREIGN KEY ("prayer_rooms_id") REFERENCES "public"."prayer_rooms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_prayer_requests_fk" FOREIGN KEY ("prayer_requests_id") REFERENCES "public"."prayer_requests"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_prayer_rooms_id_idx" ON "payload_locked_documents_rels" USING btree ("prayer_rooms_id");
  CREATE INDEX "payload_locked_documents_rels_prayer_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("prayer_requests_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "prayer_rooms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "prayer_requests" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "prayer_room_settings_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "prayer_room_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "prayer_rooms" CASCADE;
  DROP TABLE "prayer_requests" CASCADE;
  DROP TABLE "prayer_room_settings_faq" CASCADE;
  DROP TABLE "prayer_room_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_prayer_rooms_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_prayer_requests_fk";
  
  DROP INDEX "payload_locked_documents_rels_prayer_rooms_id_idx";
  DROP INDEX "payload_locked_documents_rels_prayer_requests_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "prayer_rooms_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "prayer_requests_id";
  DROP TYPE "public"."enum_prayer_rooms_day_of_week";
  DROP TYPE "public"."enum_prayer_rooms_platform";
  DROP TYPE "public"."enum_prayer_requests_category";
  DROP TYPE "public"."enum_prayer_requests_status";
  DROP TYPE "public"."enum_prayer_room_settings_meeting_platform";`)
}
