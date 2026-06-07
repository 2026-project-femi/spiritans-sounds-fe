## Local Dev Machine Setup Sequence

1. **Launch Postgres Container Locally:** Docker Dev Database.
   Run this to spin up your local database. Keeping it bound to `127.0.0.1` is still excellent hygiene on a local PC because it prevents anyone else on your local Wi-Fi/network from scanning or accessing your database:

```bash
docker run -d \
  --name spiritans-postgres-dev \
  -p 127.0.0.1:5435:5432 \
  -v spiritans_local_postgres:/var/lib/postgresql/data \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=local_dev_password \
  -e POSTGRES_DB=spiritans_sound_dev \
  --restart unless-stopped \
  postgres:16-alpine

```

2. **Purge Sanity Dependencies:** Workspace Cleanup.
   Strip the old Sanity tooling out of your local project directory:

```bash
# Remove the packages
npm uninstall next-sanity @sanity/image-url @portabletext/to-html sanity

# Delete the local sanity studio folder
rm -rf sanity

```

3. **Inject Payload v3 Packages:** Local Dependencies.
   Install the Payload framework, Postgres driver, Lexical parser tools, and `tsx` (which lets you execute your local TypeScript migration script directly without pre-compiling it):

```bash
npm install payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical @payloadcms/plugin-cloud-storage graphql
npm install @portabletext/to-html
npm install -D tsx

```

4. **Configure Local Environment Variables:** Edit .env.
   Open your `.env` file and swap out the database strings. Keep your `APP_URL` pointed to your local port:

```env
# APPLICATION
APP_URL=http://localhost:3000

# PAYLOAD CORE (LOCAL)
POSTGRES_URL=postgresql://postgres:local_dev_password@127.0.0.1:5432/spiritans_sound_dev
PAYLOAD_SECRET=DEVELOPMENT_ONLY_SECRET_STRING_12345

# S3 STORAGE (You can still point this to your R2/Spaces dev bucket)
S3_BUCKET=your_dev_bucket_name
S3_ACCESS_KEY_ID=your_access_key
S3_SECRET_ACCESS_KEY=your_secret_key
S3_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com

```

5. **Create Migration Directory:** Staging.
   Prepare the folders where your agent will write the migration script and read your exported data:

```bash
mkdir -p migration scripts
touch scripts/migrate-sanity.ts

```

---

## Running the Dev Server

Now you can hand the modified markdown prompts to your agent. Once it generates the initial `payload.config.ts` file, fire up your local development engine:

```bash
npm run dev

```

Go to `http://localhost:3000/admin` in your browser. Payload v3 will detect an empty database, prompt you to create your first local admin account, and let you inspect your fresh, Postgres-backed collections before you stream your data migration script.
