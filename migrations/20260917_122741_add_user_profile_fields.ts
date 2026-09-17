import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "book_submissions" ALTER COLUMN "author_name" DROP NOT NULL;
  ALTER TABLE "book_submissions" ALTER COLUMN "selling_price" SET DEFAULT 0;
  ALTER TABLE "book_submissions" ALTER COLUMN "selling_price" DROP NOT NULL;
  ALTER TABLE "users" ADD COLUMN "phone" varchar;
  ALTER TABLE "users" ADD COLUMN "country" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "book_submissions" ALTER COLUMN "author_name" SET NOT NULL;
  ALTER TABLE "book_submissions" ALTER COLUMN "selling_price" DROP DEFAULT;
  ALTER TABLE "book_submissions" ALTER COLUMN "selling_price" SET NOT NULL;
  ALTER TABLE "users" DROP COLUMN "phone";
  ALTER TABLE "users" DROP COLUMN "country";`)
}
