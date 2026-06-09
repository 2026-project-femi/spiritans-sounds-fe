# Run migration locally but pointing at R2
NODE_ENV=production \
S3_BUCKET=your-bucket \
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com \
S3_ACCESS_KEY_ID=your-key \
S3_SECRET_ACCESS_KEY=your-secret \
node migrate-sanity-to-payload.mjs \
  --payload http://localhost:3000 \
  --email admin@example.com \
  --password yourpassword