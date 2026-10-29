import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ycn_updates" ADD COLUMN "youtube_url" varchar;
  ALTER TABLE "_ycn_updates_v" ADD COLUMN "version_youtube_url" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ycn_updates" DROP COLUMN "youtube_url";
  ALTER TABLE "_ycn_updates_v" DROP COLUMN "version_youtube_url";`)
}
