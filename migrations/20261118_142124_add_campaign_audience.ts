import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_email_campaigns_audience" AS ENUM('subscribers', 'book-launch', 'book-launch-unreminded', 'all');
  ALTER TABLE "email_campaigns" ADD COLUMN "audience" "enum_email_campaigns_audience" DEFAULT 'subscribers' NOT NULL;
  ALTER TABLE "email_campaigns" ADD COLUMN "mark_reminder_sent" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "email_campaigns" DROP COLUMN "audience";
  ALTER TABLE "email_campaigns" DROP COLUMN "mark_reminder_sent";
  DROP TYPE "public"."enum_email_campaigns_audience";`)
}
