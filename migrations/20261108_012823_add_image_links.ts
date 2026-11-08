import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "article" ADD COLUMN "link_url" varchar;
  ALTER TABLE "article" ADD COLUMN "open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "_article_v" ADD COLUMN "version_link_url" varchar;
  ALTER TABLE "_article_v" ADD COLUMN "version_open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "events" ADD COLUMN "link_url" varchar;
  ALTER TABLE "events" ADD COLUMN "open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "_events_v" ADD COLUMN "version_link_url" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "homily" ADD COLUMN "link_url" varchar;
  ALTER TABLE "homily" ADD COLUMN "open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "_homily_v" ADD COLUMN "version_link_url" varchar;
  ALTER TABLE "_homily_v" ADD COLUMN "version_open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "prayer" ADD COLUMN "link_url" varchar;
  ALTER TABLE "prayer" ADD COLUMN "open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "_prayer_v" ADD COLUMN "version_link_url" varchar;
  ALTER TABLE "_prayer_v" ADD COLUMN "version_open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "music" ADD COLUMN "link_url" varchar;
  ALTER TABLE "music" ADD COLUMN "open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "_music_v" ADD COLUMN "version_link_url" varchar;
  ALTER TABLE "_music_v" ADD COLUMN "version_open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "link_url" varchar;
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "link_url" varchar;
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "open_in_new_tab" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "article" DROP COLUMN "link_url";
  ALTER TABLE "article" DROP COLUMN "open_in_new_tab";
  ALTER TABLE "_article_v" DROP COLUMN "version_link_url";
  ALTER TABLE "_article_v" DROP COLUMN "version_open_in_new_tab";
  ALTER TABLE "events" DROP COLUMN "link_url";
  ALTER TABLE "events" DROP COLUMN "open_in_new_tab";
  ALTER TABLE "_events_v" DROP COLUMN "version_link_url";
  ALTER TABLE "_events_v" DROP COLUMN "version_open_in_new_tab";
  ALTER TABLE "homily" DROP COLUMN "link_url";
  ALTER TABLE "homily" DROP COLUMN "open_in_new_tab";
  ALTER TABLE "_homily_v" DROP COLUMN "version_link_url";
  ALTER TABLE "_homily_v" DROP COLUMN "version_open_in_new_tab";
  ALTER TABLE "prayer" DROP COLUMN "link_url";
  ALTER TABLE "prayer" DROP COLUMN "open_in_new_tab";
  ALTER TABLE "_prayer_v" DROP COLUMN "version_link_url";
  ALTER TABLE "_prayer_v" DROP COLUMN "version_open_in_new_tab";
  ALTER TABLE "music" DROP COLUMN "link_url";
  ALTER TABLE "music" DROP COLUMN "open_in_new_tab";
  ALTER TABLE "_music_v" DROP COLUMN "version_link_url";
  ALTER TABLE "_music_v" DROP COLUMN "version_open_in_new_tab";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "link_url";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "open_in_new_tab";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "link_url";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "open_in_new_tab";`)
}
