import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_orders_currency" AS ENUM('NGN', 'USD', 'GBP');
  CREATE TYPE "public"."enum_orders_payment_provider" AS ENUM('paystack', 'stripe');
  CREATE TYPE "public"."enum_lyrics_of_light_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__lyrics_of_light_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "donations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"reference" varchar NOT NULL,
  	"amount" numeric NOT NULL,
  	"currency" varchar NOT NULL,
  	"donor_email" varchar NOT NULL,
  	"donor_name" varchar,
  	"message" varchar,
  	"paid_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "lyrics_of_light" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"audio_id" uuid,
  	"youtube_link" varchar,
  	"booklet_title" varchar,
  	"booklet_image_id" uuid,
  	"booklet_description" varchar,
  	"booklet_buy_link" varchar,
  	"booklet_file_id" uuid,
  	"content" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_lyrics_of_light_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_lyrics_of_light_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_audio_id" uuid,
  	"version_youtube_link" varchar,
  	"version_booklet_title" varchar,
  	"version_booklet_image_id" uuid,
  	"version_booklet_description" varchar,
  	"version_booklet_buy_link" varchar,
  	"version_booklet_file_id" uuid,
  	"version_content" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__lyrics_of_light_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "publications" ADD COLUMN "price_amount_u_s_d" numeric;
  ALTER TABLE "publications" ADD COLUMN "price_amount_g_b_p" numeric;
  ALTER TABLE "_publications_v" ADD COLUMN "version_price_amount_u_s_d" numeric;
  ALTER TABLE "_publications_v" ADD COLUMN "version_price_amount_g_b_p" numeric;
  ALTER TABLE "magazine_issues" ADD COLUMN "price_amount_u_s_d" numeric;
  ALTER TABLE "magazine_issues" ADD COLUMN "price_amount_g_b_p" numeric;
  ALTER TABLE "_magazine_issues_v" ADD COLUMN "version_price_amount_u_s_d" numeric;
  ALTER TABLE "_magazine_issues_v" ADD COLUMN "version_price_amount_g_b_p" numeric;
  ALTER TABLE "orders" ADD COLUMN "currency" "enum_orders_currency" DEFAULT 'NGN';
  ALTER TABLE "orders" ADD COLUMN "payment_provider" "enum_orders_payment_provider" DEFAULT 'paystack';
  ALTER TABLE "orders" ADD COLUMN "stripe_session_id" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "donations_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lyrics_of_light_id" uuid;
  ALTER TABLE "lyrics_of_light" ADD CONSTRAINT "lyrics_of_light_audio_id_media_id_fk" FOREIGN KEY ("audio_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lyrics_of_light" ADD CONSTRAINT "lyrics_of_light_booklet_image_id_media_id_fk" FOREIGN KEY ("booklet_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lyrics_of_light" ADD CONSTRAINT "lyrics_of_light_booklet_file_id_media_id_fk" FOREIGN KEY ("booklet_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lyrics_of_light_v" ADD CONSTRAINT "_lyrics_of_light_v_parent_id_lyrics_of_light_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lyrics_of_light"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lyrics_of_light_v" ADD CONSTRAINT "_lyrics_of_light_v_version_audio_id_media_id_fk" FOREIGN KEY ("version_audio_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lyrics_of_light_v" ADD CONSTRAINT "_lyrics_of_light_v_version_booklet_image_id_media_id_fk" FOREIGN KEY ("version_booklet_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lyrics_of_light_v" ADD CONSTRAINT "_lyrics_of_light_v_version_booklet_file_id_media_id_fk" FOREIGN KEY ("version_booklet_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "donations_reference_idx" ON "donations" USING btree ("reference");
  CREATE INDEX "donations_updated_at_idx" ON "donations" USING btree ("updated_at");
  CREATE INDEX "donations_created_at_idx" ON "donations" USING btree ("created_at");
  CREATE UNIQUE INDEX "lyrics_of_light_slug_idx" ON "lyrics_of_light" USING btree ("slug");
  CREATE INDEX "lyrics_of_light_audio_idx" ON "lyrics_of_light" USING btree ("audio_id");
  CREATE INDEX "lyrics_of_light_booklet_image_idx" ON "lyrics_of_light" USING btree ("booklet_image_id");
  CREATE INDEX "lyrics_of_light_booklet_file_idx" ON "lyrics_of_light" USING btree ("booklet_file_id");
  CREATE INDEX "lyrics_of_light_updated_at_idx" ON "lyrics_of_light" USING btree ("updated_at");
  CREATE INDEX "lyrics_of_light_created_at_idx" ON "lyrics_of_light" USING btree ("created_at");
  CREATE INDEX "lyrics_of_light__status_idx" ON "lyrics_of_light" USING btree ("_status");
  CREATE INDEX "_lyrics_of_light_v_parent_idx" ON "_lyrics_of_light_v" USING btree ("parent_id");
  CREATE INDEX "_lyrics_of_light_v_version_version_slug_idx" ON "_lyrics_of_light_v" USING btree ("version_slug");
  CREATE INDEX "_lyrics_of_light_v_version_version_audio_idx" ON "_lyrics_of_light_v" USING btree ("version_audio_id");
  CREATE INDEX "_lyrics_of_light_v_version_version_booklet_image_idx" ON "_lyrics_of_light_v" USING btree ("version_booklet_image_id");
  CREATE INDEX "_lyrics_of_light_v_version_version_booklet_file_idx" ON "_lyrics_of_light_v" USING btree ("version_booklet_file_id");
  CREATE INDEX "_lyrics_of_light_v_version_version_updated_at_idx" ON "_lyrics_of_light_v" USING btree ("version_updated_at");
  CREATE INDEX "_lyrics_of_light_v_version_version_created_at_idx" ON "_lyrics_of_light_v" USING btree ("version_created_at");
  CREATE INDEX "_lyrics_of_light_v_version_version__status_idx" ON "_lyrics_of_light_v" USING btree ("version__status");
  CREATE INDEX "_lyrics_of_light_v_created_at_idx" ON "_lyrics_of_light_v" USING btree ("created_at");
  CREATE INDEX "_lyrics_of_light_v_updated_at_idx" ON "_lyrics_of_light_v" USING btree ("updated_at");
  CREATE INDEX "_lyrics_of_light_v_latest_idx" ON "_lyrics_of_light_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_donations_fk" FOREIGN KEY ("donations_id") REFERENCES "public"."donations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lyrics_of_light_fk" FOREIGN KEY ("lyrics_of_light_id") REFERENCES "public"."lyrics_of_light"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_donations_id_idx" ON "payload_locked_documents_rels" USING btree ("donations_id");
  CREATE INDEX "payload_locked_documents_rels_lyrics_of_light_id_idx" ON "payload_locked_documents_rels" USING btree ("lyrics_of_light_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "donations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lyrics_of_light" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_lyrics_of_light_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "donations" CASCADE;
  DROP TABLE "lyrics_of_light" CASCADE;
  DROP TABLE "_lyrics_of_light_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_donations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lyrics_of_light_fk";
  
  DROP INDEX "payload_locked_documents_rels_donations_id_idx";
  DROP INDEX "payload_locked_documents_rels_lyrics_of_light_id_idx";
  ALTER TABLE "publications" DROP COLUMN "price_amount_u_s_d";
  ALTER TABLE "publications" DROP COLUMN "price_amount_g_b_p";
  ALTER TABLE "_publications_v" DROP COLUMN "version_price_amount_u_s_d";
  ALTER TABLE "_publications_v" DROP COLUMN "version_price_amount_g_b_p";
  ALTER TABLE "magazine_issues" DROP COLUMN "price_amount_u_s_d";
  ALTER TABLE "magazine_issues" DROP COLUMN "price_amount_g_b_p";
  ALTER TABLE "_magazine_issues_v" DROP COLUMN "version_price_amount_u_s_d";
  ALTER TABLE "_magazine_issues_v" DROP COLUMN "version_price_amount_g_b_p";
  ALTER TABLE "orders" DROP COLUMN "currency";
  ALTER TABLE "orders" DROP COLUMN "payment_provider";
  ALTER TABLE "orders" DROP COLUMN "stripe_session_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "donations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lyrics_of_light_id";
  DROP TYPE "public"."enum_orders_currency";
  DROP TYPE "public"."enum_orders_payment_provider";
  DROP TYPE "public"."enum_lyrics_of_light_status";
  DROP TYPE "public"."enum__lyrics_of_light_v_version_status";`)
}
