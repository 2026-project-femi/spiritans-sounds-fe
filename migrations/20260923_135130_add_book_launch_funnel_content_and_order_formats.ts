import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_orders_format" AS ENUM('ebook', 'paperback');
  CREATE TABLE "book_launch_settings_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "book_launch_settings_audio_previews" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"audio_file_id" uuid,
  	"audio_url" varchar
  );
  
  CREATE TABLE "book_launch_settings_bookshops" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"address" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"phone" varchar
  );
  
  CREATE TABLE "book_launch_settings_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"detail" varchar,
  	"quote" varchar NOT NULL
  );
  
   ALTER TABLE "orders" ADD COLUMN "format" "enum_orders_format" DEFAULT 'ebook';
   ALTER TABLE "orders" ADD COLUMN "is_preorder" boolean DEFAULT false;
   ALTER TABLE "orders" ADD COLUMN "shipping_address" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipping_city" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipping_country" varchar;
  ALTER TABLE "orders" ADD COLUMN "shipping_phone" varchar;
  ALTER TABLE "book_launch_settings" ADD COLUMN "launch_date_i_s_o" varchar DEFAULT '2026-11-21T17:00:00+01:00';
  ALTER TABLE "book_launch_settings" ADD COLUMN "pages" varchar DEFAULT '320 pages';
  ALTER TABLE "book_launch_settings" ADD COLUMN "isbn" varchar DEFAULT '978-978-782-140-3';
  ALTER TABLE "book_launch_settings" ADD COLUMN "publisher" varchar DEFAULT 'Spiritans Sound';
  ALTER TABLE "book_launch_settings" ADD COLUMN "imprint" varchar DEFAULT 'Treasures Unveiler';
  ALTER TABLE "book_launch_settings" ADD COLUMN "language" varchar DEFAULT 'English';
  ALTER TABLE "book_launch_settings" ADD COLUMN "category" varchar DEFAULT 'Christian Living · Relationships · Psychology';
  ALTER TABLE "book_launch_settings" ADD COLUMN "is_preorder" boolean DEFAULT true;
  ALTER TABLE "book_launch_settings" ADD COLUMN "publication_id" uuid;
  ALTER TABLE "book_launch_settings" ADD COLUMN "ebook_available" boolean DEFAULT true;
  ALTER TABLE "book_launch_settings" ADD COLUMN "ebook_price_n_g_n" numeric DEFAULT 5000 NOT NULL;
  ALTER TABLE "book_launch_settings" ADD COLUMN "ebook_price_u_s_d" numeric DEFAULT 10 NOT NULL;
  ALTER TABLE "book_launch_settings" ADD COLUMN "ebook_price_g_b_p" numeric DEFAULT 8 NOT NULL;
  ALTER TABLE "book_launch_settings" ADD COLUMN "ebook_price_note" varchar DEFAULT 'Instant download · PDF & ePub';
  ALTER TABLE "book_launch_settings" ADD COLUMN "paperback_available" boolean DEFAULT true;
  ALTER TABLE "book_launch_settings" ADD COLUMN "paperback_price_n_g_n" numeric DEFAULT 12000 NOT NULL;
  ALTER TABLE "book_launch_settings" ADD COLUMN "paperback_price_u_s_d" numeric DEFAULT 25 NOT NULL;
  ALTER TABLE "book_launch_settings" ADD COLUMN "paperback_price_g_b_p" numeric DEFAULT 20 NOT NULL;
  ALTER TABLE "book_launch_settings" ADD COLUMN "paperback_price_note" varchar DEFAULT 'UK postage included · posted on purchase · physical delivery';
  ALTER TABLE "book_launch_settings" ADD COLUMN "preview_pdf_id" uuid;
  ALTER TABLE "book_launch_settings" ADD COLUMN "excerpt_title" varchar DEFAULT 'From Chapter One — The Veil';
  ALTER TABLE "book_launch_settings" ADD COLUMN "excerpt_text" varchar DEFAULT 'A lie rarely arrives as a lie. It arrives as an explanation — reasonable, well-timed, and delivered by someone whose face you know better than your own. That is what makes deception so difficult to detect: it does not contradict the truth so much as stand comfortably in its place.
  
  And so we do not begin by asking, "Is this person lying?" We begin by asking a gentler and far more useful question: "What keeps repeating?" Deception can survive a single conversation. It cannot survive a pattern honestly examined.';
  ALTER TABLE "book_launch_settings" ADD COLUMN "videos_heading" varchar DEFAULT 'Watch & Listen';
  ALTER TABLE "book_launch_settings" ADD COLUMN "videos_intro" varchar DEFAULT 'Launch interviews, author reflections and discussions on detecting deception.';
  ALTER TABLE "book_launch_settings" ADD COLUMN "audio_heading" varchar DEFAULT 'Listen to a Preview';
  ALTER TABLE "book_launch_settings" ADD COLUMN "audio_intro" varchar DEFAULT 'Sample clips from the audiobook edition. Listen to excerpts narrated by the author.';
  ALTER TABLE "book_launch_settings" ADD COLUMN "bookshops_heading" varchar DEFAULT 'Buy in Person in Nigeria';
  ALTER TABLE "book_launch_settings" ADD COLUMN "bookshops_intro" varchar DEFAULT 'Prefer to buy from a physical shop? Behind the Veil is stocked at the following Nigerian bookshops. Visit any of these to pick up your copy directly.';
  ALTER TABLE "book_launch_settings" ADD COLUMN "testimonials_heading" varchar DEFAULT 'What readers are saying';
  ALTER TABLE "book_launch_settings_videos" ADD CONSTRAINT "book_launch_settings_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."book_launch_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "book_launch_settings_audio_previews" ADD CONSTRAINT "book_launch_settings_audio_previews_audio_file_id_media_id_fk" FOREIGN KEY ("audio_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "book_launch_settings_audio_previews" ADD CONSTRAINT "book_launch_settings_audio_previews_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."book_launch_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "book_launch_settings_bookshops" ADD CONSTRAINT "book_launch_settings_bookshops_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."book_launch_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "book_launch_settings_testimonials" ADD CONSTRAINT "book_launch_settings_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."book_launch_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "book_launch_settings_videos_order_idx" ON "book_launch_settings_videos" USING btree ("_order");
  CREATE INDEX "book_launch_settings_videos_parent_id_idx" ON "book_launch_settings_videos" USING btree ("_parent_id");
  CREATE INDEX "book_launch_settings_audio_previews_order_idx" ON "book_launch_settings_audio_previews" USING btree ("_order");
  CREATE INDEX "book_launch_settings_audio_previews_parent_id_idx" ON "book_launch_settings_audio_previews" USING btree ("_parent_id");
  CREATE INDEX "book_launch_settings_audio_previews_audio_file_idx" ON "book_launch_settings_audio_previews" USING btree ("audio_file_id");
  CREATE INDEX "book_launch_settings_bookshops_order_idx" ON "book_launch_settings_bookshops" USING btree ("_order");
  CREATE INDEX "book_launch_settings_bookshops_parent_id_idx" ON "book_launch_settings_bookshops" USING btree ("_parent_id");
  CREATE INDEX "book_launch_settings_testimonials_order_idx" ON "book_launch_settings_testimonials" USING btree ("_order");
  CREATE INDEX "book_launch_settings_testimonials_parent_id_idx" ON "book_launch_settings_testimonials" USING btree ("_parent_id");
  ALTER TABLE "book_launch_settings" ADD CONSTRAINT "book_launch_settings_publication_id_publications_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "book_launch_settings" ADD CONSTRAINT "book_launch_settings_preview_pdf_id_media_id_fk" FOREIGN KEY ("preview_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "book_launch_settings_publication_idx" ON "book_launch_settings" USING btree ("publication_id");
  CREATE INDEX "book_launch_settings_preview_pdf_idx" ON "book_launch_settings" USING btree ("preview_pdf_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "book_launch_settings_videos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "book_launch_settings_audio_previews" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "book_launch_settings_bookshops" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "book_launch_settings_testimonials" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "book_launch_settings_videos" CASCADE;
  DROP TABLE "book_launch_settings_audio_previews" CASCADE;
  DROP TABLE "book_launch_settings_bookshops" CASCADE;
  DROP TABLE "book_launch_settings_testimonials" CASCADE;
  ALTER TABLE "book_launch_settings" DROP CONSTRAINT "book_launch_settings_publication_id_publications_id_fk";
  
  ALTER TABLE "book_launch_settings" DROP CONSTRAINT "book_launch_settings_preview_pdf_id_media_id_fk";
  
  DROP INDEX "book_launch_settings_publication_idx";
  DROP INDEX "book_launch_settings_preview_pdf_idx";
   ALTER TABLE "orders" DROP COLUMN "format";
   ALTER TABLE "orders" DROP COLUMN "is_preorder";
   ALTER TABLE "orders" DROP COLUMN "shipping_address";
  ALTER TABLE "orders" DROP COLUMN "shipping_city";
  ALTER TABLE "orders" DROP COLUMN "shipping_country";
  ALTER TABLE "orders" DROP COLUMN "shipping_phone";
  ALTER TABLE "book_launch_settings" DROP COLUMN "launch_date_i_s_o";
  ALTER TABLE "book_launch_settings" DROP COLUMN "pages";
  ALTER TABLE "book_launch_settings" DROP COLUMN "isbn";
  ALTER TABLE "book_launch_settings" DROP COLUMN "publisher";
  ALTER TABLE "book_launch_settings" DROP COLUMN "imprint";
  ALTER TABLE "book_launch_settings" DROP COLUMN "language";
  ALTER TABLE "book_launch_settings" DROP COLUMN "category";
  ALTER TABLE "book_launch_settings" DROP COLUMN "is_preorder";
  ALTER TABLE "book_launch_settings" DROP COLUMN "publication_id";
  ALTER TABLE "book_launch_settings" DROP COLUMN "ebook_available";
  ALTER TABLE "book_launch_settings" DROP COLUMN "ebook_price_n_g_n";
  ALTER TABLE "book_launch_settings" DROP COLUMN "ebook_price_u_s_d";
  ALTER TABLE "book_launch_settings" DROP COLUMN "ebook_price_g_b_p";
  ALTER TABLE "book_launch_settings" DROP COLUMN "ebook_price_note";
  ALTER TABLE "book_launch_settings" DROP COLUMN "paperback_available";
  ALTER TABLE "book_launch_settings" DROP COLUMN "paperback_price_n_g_n";
  ALTER TABLE "book_launch_settings" DROP COLUMN "paperback_price_u_s_d";
  ALTER TABLE "book_launch_settings" DROP COLUMN "paperback_price_g_b_p";
  ALTER TABLE "book_launch_settings" DROP COLUMN "paperback_price_note";
  ALTER TABLE "book_launch_settings" DROP COLUMN "preview_pdf_id";
  ALTER TABLE "book_launch_settings" DROP COLUMN "excerpt_title";
  ALTER TABLE "book_launch_settings" DROP COLUMN "excerpt_text";
  ALTER TABLE "book_launch_settings" DROP COLUMN "videos_heading";
  ALTER TABLE "book_launch_settings" DROP COLUMN "videos_intro";
  ALTER TABLE "book_launch_settings" DROP COLUMN "audio_heading";
  ALTER TABLE "book_launch_settings" DROP COLUMN "audio_intro";
  ALTER TABLE "book_launch_settings" DROP COLUMN "bookshops_heading";
  ALTER TABLE "book_launch_settings" DROP COLUMN "bookshops_intro";
  ALTER TABLE "book_launch_settings" DROP COLUMN "testimonials_heading";
  DROP TYPE "public"."enum_orders_format";`)
}
