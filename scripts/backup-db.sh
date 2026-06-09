#!/bin/bash
# scripts/backup-db.sh
# ─────────────────────────────────────────────────────────────────────────────
# Backs up the Payload PostgreSQL database and uploads to Cloudflare R2.
# Keeps the last N backups in R2 (auto-prunes older ones).
#
# Required env vars:
#   POSTGRES_URL          — postgresql://user:pass@host:5432/dbname
#   S3_BUCKET             — your R2 bucket name
#   S3_ENDPOINT           — https://<account-id>.r2.cloudflarestorage.com
#   S3_ACCESS_KEY_ID      — R2 access key
#   S3_SECRET_ACCESS_KEY  — R2 secret key
#
# Optional:
#   BACKUP_RETAIN_COUNT   — number of backups to keep (default: 14)
#   BACKUP_PREFIX         — R2 key prefix (default: db-backups)
#
# Usage:
#   ./scripts/backup-db.sh
#   BACKUP_RETAIN_COUNT=30 ./scripts/backup-db.sh
#
# Install deps (Ubuntu/Debian):
#   apt-get install -y postgresql-client awscli
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────

RETAIN="${BACKUP_RETAIN_COUNT:-14}"
PREFIX="${BACKUP_PREFIX:-db-backups}"
TIMESTAMP="$(date -u +%Y-%m-%dT%H-%M-%SZ)"
FILENAME="backup-${TIMESTAMP}.sql.gz"
TMPFILE="/tmp/${FILENAME}"

# ── Validate ──────────────────────────────────────────────────────────────────

for var in POSTGRES_URL S3_BUCKET S3_ENDPOINT S3_ACCESS_KEY_ID S3_SECRET_ACCESS_KEY; do
  if [[ -z "${!var:-}" ]]; then
    echo "ERROR: $var is not set" >&2
    exit 1
  fi
done

# ── Dump ──────────────────────────────────────────────────────────────────────

echo "[backup] Dumping database..."
pg_dump "$POSTGRES_URL" \
  --no-owner \
  --no-acl \
  --format=plain \
  | gzip > "$TMPFILE"

SIZE=$(du -sh "$TMPFILE" | cut -f1)
echo "[backup] Dump complete: ${FILENAME} (${SIZE})"

# ── Upload to R2 ──────────────────────────────────────────────────────────────

# Configure the AWS CLI to talk to R2
export AWS_ACCESS_KEY_ID="$S3_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$S3_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="auto"

R2_KEY="${PREFIX}/${FILENAME}"

echo "[backup] Uploading to R2: s3://${S3_BUCKET}/${R2_KEY}"
aws s3 cp "$TMPFILE" "s3://${S3_BUCKET}/${R2_KEY}" \
  --endpoint-url "$S3_ENDPOINT" \
  --no-progress

echo "[backup] Upload complete."

# ── Cleanup local temp file ───────────────────────────────────────────────────

rm -f "$TMPFILE"

# ── Prune old backups in R2 ───────────────────────────────────────────────────
# List all backups, sorted oldest-first, delete any beyond the retain count.

echo "[backup] Pruning old backups (keeping last ${RETAIN})..."

ALL_KEYS=$(aws s3 ls "s3://${S3_BUCKET}/${PREFIX}/" \
  --endpoint-url "$S3_ENDPOINT" \
  | sort \
  | awk '{print $NF}')

TOTAL=$(echo "$ALL_KEYS" | grep -c . || true)

if [[ "$TOTAL" -gt "$RETAIN" ]]; then
  DELETE_COUNT=$(( TOTAL - RETAIN ))
  TO_DELETE=$(echo "$ALL_KEYS" | head -n "$DELETE_COUNT")
  echo "[backup] Deleting ${DELETE_COUNT} old backup(s)..."
  while IFS= read -r key; do
    echo "  Deleting: ${PREFIX}/${key}"
    aws s3 rm "s3://${S3_BUCKET}/${PREFIX}/${key}" \
      --endpoint-url "$S3_ENDPOINT"
  done <<< "$TO_DELETE"
else
  echo "[backup] ${TOTAL} backup(s) on record — no pruning needed."
fi

echo "[backup] Done. Backup: ${R2_KEY}"