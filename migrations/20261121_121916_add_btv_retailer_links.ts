import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "book_launch_settings" ADD COLUMN "amazon_kindle_url" varchar;
  ALTER TABLE "book_launch_settings" ADD COLUMN "amazon_paperback_url" varchar;
  ALTER TABLE "book_launch_settings" ADD COLUMN "selar_url" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "book_launch_settings" DROP COLUMN "amazon_kindle_url";
  ALTER TABLE "book_launch_settings" DROP COLUMN "amazon_paperback_url";
  ALTER TABLE "book_launch_settings" DROP COLUMN "selar_url";`)
}
