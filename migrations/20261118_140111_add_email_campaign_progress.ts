import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_email_campaigns_status" ADD VALUE 'partial' BEFORE 'sent';
  ALTER TABLE "email_campaigns" ALTER COLUMN "sent_count" SET DEFAULT 0;
  ALTER TABLE "email_campaigns" ADD COLUMN "failed_count" numeric DEFAULT 0;
  ALTER TABLE "email_campaigns" ADD COLUMN "attempted_count" numeric DEFAULT 0;
  ALTER TABLE "email_campaigns" ADD COLUMN "failed_emails" jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "email_campaigns" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "email_campaigns" ALTER COLUMN "status" SET DEFAULT 'draft'::text;
  DROP TYPE "public"."enum_email_campaigns_status";
  CREATE TYPE "public"."enum_email_campaigns_status" AS ENUM('draft', 'paused', 'sent');
  ALTER TABLE "email_campaigns" ALTER COLUMN "status" SET DEFAULT 'draft'::"public"."enum_email_campaigns_status";
  ALTER TABLE "email_campaigns" ALTER COLUMN "status" SET DATA TYPE "public"."enum_email_campaigns_status" USING "status"::"public"."enum_email_campaigns_status";
  ALTER TABLE "email_campaigns" ALTER COLUMN "sent_count" DROP DEFAULT;
  ALTER TABLE "email_campaigns" DROP COLUMN "failed_count";
  ALTER TABLE "email_campaigns" DROP COLUMN "attempted_count";
  ALTER TABLE "email_campaigns" DROP COLUMN "failed_emails";`)
}
