import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_author_type" AS ENUM('standard', 'young_creator');
  CREATE TYPE "public"."enum_publications_publishing_status" AS ENUM('draft', 'under_review', 'approved', 'published', 'suspended', 'archived');
  CREATE TYPE "public"."enum__publications_v_version_publishing_status" AS ENUM('draft', 'under_review', 'approved', 'published', 'suspended', 'archived');
  CREATE TYPE "public"."enum_book_submissions_status" AS ENUM('pending', 'reviewed', 'approved', 'rejected');
  CREATE TYPE "public"."enum_payouts_status" AS ENUM('pending', 'processing', 'paid', 'failed');
  ALTER TYPE "public"."enum_users_role" ADD VALUE 'publishing_admin' BEFORE 'editor';
  ALTER TYPE "public"."enum_users_role" ADD VALUE 'author';
  CREATE TABLE "book_submissions" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"submitter_id" uuid,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"country" varchar,
  	"author_name" varchar NOT NULL,
  	"book_title" varchar NOT NULL,
  	"category_id" uuid,
  	"description" varchar NOT NULL,
  	"author_bio" varchar,
  	"selling_price" numeric NOT NULL,
  	"book_cover_id" uuid,
  	"book_pdf_id" uuid,
  	"bank_details_bank_name" varchar,
  	"bank_details_account_name" varchar,
  	"bank_details_account_number" varchar,
  	"bank_details_sort_code_or_routing_number" varchar,
  	"status" "enum_book_submissions_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payouts" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"author_id" uuid NOT NULL,
  	"amount" numeric NOT NULL,
  	"payment_date" timestamp(3) with time zone,
  	"reference" varchar NOT NULL,
  	"status" "enum_payouts_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "commission_settings" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"standard_commission_rate" numeric DEFAULT 15 NOT NULL,
  	"minimum_payout_threshold" numeric DEFAULT 10000 NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;
  ALTER TABLE "users" ADD COLUMN "author_type" "enum_users_author_type" DEFAULT 'standard';
  ALTER TABLE "users" ADD COLUMN "author_bio" varchar;
  ALTER TABLE "users" ADD COLUMN "bank_details_bank_name" varchar;
  ALTER TABLE "users" ADD COLUMN "bank_details_account_name" varchar;
  ALTER TABLE "users" ADD COLUMN "bank_details_account_number" varchar;
  ALTER TABLE "users" ADD COLUMN "bank_details_sort_code_or_routing_number" varchar;
  ALTER TABLE "article" ADD COLUMN "views" numeric DEFAULT 0;
  ALTER TABLE "_article_v" ADD COLUMN "version_views" numeric DEFAULT 0;
  ALTER TABLE "homily" ADD COLUMN "views" numeric DEFAULT 0;
  ALTER TABLE "_homily_v" ADD COLUMN "version_views" numeric DEFAULT 0;
  ALTER TABLE "publications" ADD COLUMN "author_id" uuid;
  ALTER TABLE "publications" ADD COLUMN "category_id" uuid;
  ALTER TABLE "publications" ADD COLUMN "publishing_status" "enum_publications_publishing_status" DEFAULT 'draft';
  ALTER TABLE "publications" ADD COLUMN "is_preorder" boolean DEFAULT false;
  ALTER TABLE "publications" ADD COLUMN "views" numeric DEFAULT 0;
  ALTER TABLE "publications" ADD COLUMN "total_sales" numeric DEFAULT 0;
  ALTER TABLE "publications" ADD COLUMN "gross_revenue" numeric DEFAULT 0;
  ALTER TABLE "_publications_v" ADD COLUMN "version_author_id" uuid;
  ALTER TABLE "_publications_v" ADD COLUMN "version_category_id" uuid;
  ALTER TABLE "_publications_v" ADD COLUMN "version_publishing_status" "enum__publications_v_version_publishing_status" DEFAULT 'draft';
  ALTER TABLE "_publications_v" ADD COLUMN "version_is_preorder" boolean DEFAULT false;
  ALTER TABLE "_publications_v" ADD COLUMN "version_views" numeric DEFAULT 0;
  ALTER TABLE "_publications_v" ADD COLUMN "version_total_sales" numeric DEFAULT 0;
  ALTER TABLE "_publications_v" ADD COLUMN "version_gross_revenue" numeric DEFAULT 0;
  ALTER TABLE "orders" ADD COLUMN "payment_processing_fee" numeric;
  ALTER TABLE "orders" ADD COLUMN "commission_rate" numeric;
  ALTER TABLE "orders" ADD COLUMN "commission_amount" numeric;
  ALTER TABLE "orders" ADD COLUMN "author_earnings" numeric;
  ALTER TABLE "posts" ADD COLUMN "views" numeric DEFAULT 0;
  ALTER TABLE "_posts_v" ADD COLUMN "version_views" numeric DEFAULT 0;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "book_submissions_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payouts_id" uuid;
  ALTER TABLE "book_submissions" ADD CONSTRAINT "book_submissions_submitter_id_users_id_fk" FOREIGN KEY ("submitter_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "book_submissions" ADD CONSTRAINT "book_submissions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "book_submissions" ADD CONSTRAINT "book_submissions_book_cover_id_media_id_fk" FOREIGN KEY ("book_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "book_submissions" ADD CONSTRAINT "book_submissions_book_pdf_id_media_id_fk" FOREIGN KEY ("book_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payouts" ADD CONSTRAINT "payouts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "book_submissions_submitter_idx" ON "book_submissions" USING btree ("submitter_id");
  CREATE INDEX "book_submissions_category_idx" ON "book_submissions" USING btree ("category_id");
  CREATE INDEX "book_submissions_book_cover_idx" ON "book_submissions" USING btree ("book_cover_id");
  CREATE INDEX "book_submissions_book_pdf_idx" ON "book_submissions" USING btree ("book_pdf_id");
  CREATE INDEX "book_submissions_updated_at_idx" ON "book_submissions" USING btree ("updated_at");
  CREATE INDEX "book_submissions_created_at_idx" ON "book_submissions" USING btree ("created_at");
  CREATE INDEX "payouts_author_idx" ON "payouts" USING btree ("author_id");
  CREATE INDEX "payouts_updated_at_idx" ON "payouts" USING btree ("updated_at");
  CREATE INDEX "payouts_created_at_idx" ON "payouts" USING btree ("created_at");
  ALTER TABLE "publications" ADD CONSTRAINT "publications_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "publications" ADD CONSTRAINT "publications_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publications_v" ADD CONSTRAINT "_publications_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_publications_v" ADD CONSTRAINT "_publications_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_book_submissions_fk" FOREIGN KEY ("book_submissions_id") REFERENCES "public"."book_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payouts_fk" FOREIGN KEY ("payouts_id") REFERENCES "public"."payouts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "publications_author_idx" ON "publications" USING btree ("author_id");
  CREATE INDEX "publications_category_idx" ON "publications" USING btree ("category_id");
  CREATE INDEX "_publications_v_version_version_author_idx" ON "_publications_v" USING btree ("version_author_id");
  CREATE INDEX "_publications_v_version_version_category_idx" ON "_publications_v" USING btree ("version_category_id");
  CREATE INDEX "payload_locked_documents_rels_book_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("book_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_payouts_id_idx" ON "payload_locked_documents_rels" USING btree ("payouts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "book_submissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payouts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "commission_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "book_submissions" CASCADE;
  DROP TABLE "payouts" CASCADE;
  DROP TABLE "commission_settings" CASCADE;
  ALTER TABLE "publications" DROP CONSTRAINT "publications_author_id_users_id_fk";
  
  ALTER TABLE "publications" DROP CONSTRAINT "publications_category_id_categories_id_fk";
  
  ALTER TABLE "_publications_v" DROP CONSTRAINT "_publications_v_version_author_id_users_id_fk";
  
  ALTER TABLE "_publications_v" DROP CONSTRAINT "_publications_v_version_category_id_categories_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_book_submissions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payouts_fk";
  
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'contributor'::text;
  DROP TYPE "public"."enum_users_role";
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'contributor');
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'contributor'::"public"."enum_users_role";
  ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."enum_users_role" USING "role"::"public"."enum_users_role";
  DROP INDEX "publications_author_idx";
  DROP INDEX "publications_category_idx";
  DROP INDEX "_publications_v_version_version_author_idx";
  DROP INDEX "_publications_v_version_version_category_idx";
  DROP INDEX "payload_locked_documents_rels_book_submissions_id_idx";
  DROP INDEX "payload_locked_documents_rels_payouts_id_idx";
  ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL;
  ALTER TABLE "users" DROP COLUMN "author_type";
  ALTER TABLE "users" DROP COLUMN "author_bio";
  ALTER TABLE "users" DROP COLUMN "bank_details_bank_name";
  ALTER TABLE "users" DROP COLUMN "bank_details_account_name";
  ALTER TABLE "users" DROP COLUMN "bank_details_account_number";
  ALTER TABLE "users" DROP COLUMN "bank_details_sort_code_or_routing_number";
  ALTER TABLE "article" DROP COLUMN "views";
  ALTER TABLE "_article_v" DROP COLUMN "version_views";
  ALTER TABLE "homily" DROP COLUMN "views";
  ALTER TABLE "_homily_v" DROP COLUMN "version_views";
  ALTER TABLE "publications" DROP COLUMN "author_id";
  ALTER TABLE "publications" DROP COLUMN "category_id";
  ALTER TABLE "publications" DROP COLUMN "publishing_status";
  ALTER TABLE "publications" DROP COLUMN "is_preorder";
  ALTER TABLE "publications" DROP COLUMN "views";
  ALTER TABLE "publications" DROP COLUMN "total_sales";
  ALTER TABLE "publications" DROP COLUMN "gross_revenue";
  ALTER TABLE "_publications_v" DROP COLUMN "version_author_id";
  ALTER TABLE "_publications_v" DROP COLUMN "version_category_id";
  ALTER TABLE "_publications_v" DROP COLUMN "version_publishing_status";
  ALTER TABLE "_publications_v" DROP COLUMN "version_is_preorder";
  ALTER TABLE "_publications_v" DROP COLUMN "version_views";
  ALTER TABLE "_publications_v" DROP COLUMN "version_total_sales";
  ALTER TABLE "_publications_v" DROP COLUMN "version_gross_revenue";
  ALTER TABLE "orders" DROP COLUMN "payment_processing_fee";
  ALTER TABLE "orders" DROP COLUMN "commission_rate";
  ALTER TABLE "orders" DROP COLUMN "commission_amount";
  ALTER TABLE "orders" DROP COLUMN "author_earnings";
  ALTER TABLE "posts" DROP COLUMN "views";
  ALTER TABLE "_posts_v" DROP COLUMN "version_views";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "book_submissions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payouts_id";
  DROP TYPE "public"."enum_users_author_type";
  DROP TYPE "public"."enum_publications_publishing_status";
  DROP TYPE "public"."enum__publications_v_version_publishing_status";
  DROP TYPE "public"."enum_book_submissions_status";
  DROP TYPE "public"."enum_payouts_status";`)
}
