import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lyrics_of_light" ADD COLUMN "lyrics" varchar;
  ALTER TABLE "_lyrics_of_light_v" ADD COLUMN "version_lyrics" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lyrics_of_light" DROP COLUMN "lyrics";
  ALTER TABLE "_lyrics_of_light_v" DROP COLUMN "version_lyrics";`)
}
