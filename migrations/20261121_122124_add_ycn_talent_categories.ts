import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_young_creators_primary_category" ADD VALUE 'fashion';
  ALTER TYPE "public"."enum_young_creators_primary_category" ADD VALUE 'sports';
  ALTER TYPE "public"."enum_young_creators_primary_category" ADD VALUE 'others';
  ALTER TYPE "public"."enum__young_creators_v_version_primary_category" ADD VALUE 'fashion';
  ALTER TYPE "public"."enum__young_creators_v_version_primary_category" ADD VALUE 'sports';
  ALTER TYPE "public"."enum__young_creators_v_version_primary_category" ADD VALUE 'others';
  ALTER TYPE "public"."enum_ycn_mentor_applications_expertise" ADD VALUE 'fashion';
  ALTER TYPE "public"."enum_ycn_mentor_applications_expertise" ADD VALUE 'sports';
  ALTER TYPE "public"."enum_ycn_mentor_applications_expertise" ADD VALUE 'others';
  ALTER TYPE "public"."enum_ycn_opportunities_categories" ADD VALUE 'fashion';
  ALTER TYPE "public"."enum_ycn_opportunities_categories" ADD VALUE 'sports';
  ALTER TYPE "public"."enum_ycn_opportunities_categories" ADD VALUE 'others';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "young_creators" ALTER COLUMN "primary_category" SET DATA TYPE text;
  DROP TYPE "public"."enum_young_creators_primary_category";
  CREATE TYPE "public"."enum_young_creators_primary_category" AS ENUM('writing', 'music', 'visual-art', 'photography', 'dance', 'digital', 'technology');
  ALTER TABLE "young_creators" ALTER COLUMN "primary_category" SET DATA TYPE "public"."enum_young_creators_primary_category" USING "primary_category"::"public"."enum_young_creators_primary_category";
  ALTER TABLE "_young_creators_v" ALTER COLUMN "version_primary_category" SET DATA TYPE text;
  DROP TYPE "public"."enum__young_creators_v_version_primary_category";
  CREATE TYPE "public"."enum__young_creators_v_version_primary_category" AS ENUM('writing', 'music', 'visual-art', 'photography', 'dance', 'digital', 'technology');
  ALTER TABLE "_young_creators_v" ALTER COLUMN "version_primary_category" SET DATA TYPE "public"."enum__young_creators_v_version_primary_category" USING "version_primary_category"::"public"."enum__young_creators_v_version_primary_category";
  ALTER TABLE "ycn_mentor_applications_expertise" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_ycn_mentor_applications_expertise";
  CREATE TYPE "public"."enum_ycn_mentor_applications_expertise" AS ENUM('writing', 'music', 'visual-art', 'photography', 'dance', 'digital', 'technology');
  ALTER TABLE "ycn_mentor_applications_expertise" ALTER COLUMN "value" SET DATA TYPE "public"."enum_ycn_mentor_applications_expertise" USING "value"::"public"."enum_ycn_mentor_applications_expertise";
  ALTER TABLE "ycn_opportunities_categories" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_ycn_opportunities_categories";
  CREATE TYPE "public"."enum_ycn_opportunities_categories" AS ENUM('writing', 'music', 'visual-art', 'photography', 'dance', 'digital', 'technology');
  ALTER TABLE "ycn_opportunities_categories" ALTER COLUMN "value" SET DATA TYPE "public"."enum_ycn_opportunities_categories" USING "value"::"public"."enum_ycn_opportunities_categories";`)
}
