import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_homily_category" AS ENUM('Sunday', 'Feast Day', 'Special', 'Weekday', 'Memorial', 'Solemnity');
  CREATE TYPE "public"."enum__homily_v_version_category" AS ENUM('Sunday', 'Feast Day', 'Special', 'Weekday', 'Memorial', 'Solemnity');
  ALTER TABLE "homily" ALTER COLUMN "category" SET DATA TYPE "public"."enum_homily_category" USING "category"::"public"."enum_homily_category";
  ALTER TABLE "_homily_v" ALTER COLUMN "version_category" SET DATA TYPE "public"."enum__homily_v_version_category" USING "version_category"::"public"."enum__homily_v_version_category";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homily" ALTER COLUMN "category" SET DATA TYPE varchar;
  ALTER TABLE "_homily_v" ALTER COLUMN "version_category" SET DATA TYPE varchar;
  DROP TYPE "public"."enum_homily_category";
  DROP TYPE "public"."enum__homily_v_version_category";`)
}
