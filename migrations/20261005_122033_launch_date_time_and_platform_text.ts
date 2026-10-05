import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// NOTE: Written to be idempotent (`IF NOT EXISTS` / `IF EXISTS` / guarded enum)
// so it is safe to re-run if the target database already contains some of these
// changes. Additive/conversion only — no rows are dropped.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "book_launch_settings" ALTER COLUMN "launch_date_i_s_o" DROP DEFAULT;
  ALTER TABLE "book_launch_settings" ALTER COLUMN "event_date" DROP DEFAULT;
  ALTER TABLE "book_launch_settings" ALTER COLUMN "meeting_platform" SET DATA TYPE varchar;
  ALTER TABLE "book_launch_settings" ALTER COLUMN "meeting_platform" DROP DEFAULT;
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "launch_date_time" timestamp(3) with time zone DEFAULT '2026-11-21T17:00:00+01:00' NOT NULL;
  ALTER TABLE "book_launch_settings" ADD COLUMN IF NOT EXISTS "timezone" varchar DEFAULT 'Africa/Lagos';
  DROP TYPE IF EXISTS "public"."enum_book_launch_settings_meeting_platform";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DO $do$ BEGIN CREATE TYPE "public"."enum_book_launch_settings_meeting_platform" AS ENUM('Zoom', 'Google Meet', 'YouTube Live', 'Microsoft Teams', 'Other'); EXCEPTION WHEN duplicate_object THEN NULL; END $do$;
  ALTER TABLE "book_launch_settings" ALTER COLUMN "launch_date_i_s_o" SET DEFAULT '2026-11-21T17:00:00+01:00';
  ALTER TABLE "book_launch_settings" ALTER COLUMN "event_date" SET DEFAULT 'Saturday, 21 November 2026 at 5:00 PM (WAT) / 4:00 PM (GMT)';
  ALTER TABLE "book_launch_settings" ALTER COLUMN "meeting_platform" SET DATA TYPE "public"."enum_book_launch_settings_meeting_platform" USING (CASE WHEN "meeting_platform" IN ('Zoom', 'Google Meet', 'YouTube Live', 'Microsoft Teams', 'Other') THEN "meeting_platform"::"public"."enum_book_launch_settings_meeting_platform" ELSE 'Other'::"public"."enum_book_launch_settings_meeting_platform" END);
  ALTER TABLE "book_launch_settings" ALTER COLUMN "meeting_platform" SET DEFAULT 'Zoom'::"public"."enum_book_launch_settings_meeting_platform";
  ALTER TABLE "book_launch_settings" DROP COLUMN IF EXISTS "launch_date_time";
  ALTER TABLE "book_launch_settings" DROP COLUMN IF EXISTS "timezone";`)
}
