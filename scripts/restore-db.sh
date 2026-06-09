#!/bin/bash
# scripts/restore-db.sh
# ─────────────────────────────────────────────────────────────────────────────
# Restores the latest (or a specific) backup from Cloudflare R2.
#
# Usage:
#   ./scripts/restore-db.sh                         # restores latest
#   ./scripts/restore-db.sh backup-2026-06-01.sql.gz  # restores specific file
#
# Required env vars: same as backup-db.sh
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

PREFIX="${BACKUP_PREFIX:-db-backups}"
TMPFILE="/tmp/restore-target.sql.gz"

for var in POSTGRES_URL S3_BUCKET S3_ENDPOINT S3_ACCESS_KEY_ID S3_SECRET_ACCESS_KEY; do
  if [[ -z "${!var:-}" ]]; then
    echo "ERROR: $var is not set" >&2
    exit 1
  fi
done

export AWS_ACCESS_KEY_ID="$S3_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$S3_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="auto"

# ── Resolve target file ───────────────────────────────────────────────────────

if [[ -n "${1:-}" ]]; then
  TARGET_KEY="${PREFIX}/${1}"
  echo "[restore] Using specified backup: ${TARGET_KEY}"
else
  echo "[restore] Finding latest backup in R2..."
  LATEST=$(aws s3 ls "s3://${S3_BUCKET}/${PREFIX}/" \
    --endpoint-url "$S3_ENDPOINT" \
    | sort \
    | tail -n 1 \
    | awk '{print $NF}')
  if [[ -z "$LATEST" ]]; then
    echo "ERROR: No backups found in s3://${S3_BUCKET}/${PREFIX}/" >&2
    exit 1
  fi
  TARGET_KEY="${PREFIX}/${LATEST}"
  echo "[restore] Latest backup: ${TARGET_KEY}"
fi

# ── Download ──────────────────────────────────────────────────────────────────

echo "[restore] Downloading..."
aws s3 cp "s3://${S3_BUCKET}/${TARGET_KEY}" "$TMPFILE" \
  --endpoint-url "$S3_ENDPOINT" \
  --no-progress

# ── Restore ───────────────────────────────────────────────────────────────────

echo "[restore] Restoring to database..."
gunzip -c "$TMPFILE" | psql "$POSTGRES_URL"

rm -f "$TMPFILE"
echo "[restore] Restore complete from: ${TARGET_KEY}"