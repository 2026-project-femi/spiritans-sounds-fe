import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_book_launch_settings_meeting_platform" AS ENUM('Zoom', 'Google Meet', 'YouTube Live', 'Microsoft Teams', 'Other');
  CREATE TABLE "book_launch_settings" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"book_title" varchar DEFAULT 'Behind the Veil' NOT NULL,
  	"book_slug" varchar DEFAULT 'behind-the-veil' NOT NULL,
  	"meeting_link" varchar,
  	"meeting_platform" "enum_book_launch_settings_meeting_platform" DEFAULT 'Zoom',
  	"meeting_passcode" varchar,
  	"event_date" varchar DEFAULT 'Saturday, 21 November 2026 at 5:00 PM (WAT) / 4:00 PM (GMT)',
  	"custom_note" varchar,
  	"send_confirmation_email" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "book_launch_settings" CASCADE;
  DROP TYPE "public"."enum_book_launch_settings_meeting_platform";`)
}
