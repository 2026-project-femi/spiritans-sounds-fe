# Deployment & operations runbook

## First deploy

Run once on a fresh VPS. All future deploys are automatic.

```bash
ssh user@your-vps-ip
cd /var/www/spiritans
bash scripts/first-deploy.sh
```

The script will pause and ask you to fill in `.env` before continuing. Once done,
it installs all dependencies, starts the PostgreSQL container, runs Payload
migrations, starts the app under PM2, and registers the nightly backup cron.

---

## Ongoing deploys

```bash
git push origin main
```

GitHub Actions SSHs into the VPS, pulls the latest code, runs `pnpm build`,
runs `pnpm payload migrate`, and restarts PM2. No manual steps required.

---

## Database backups

### How it works

A cron job runs `scripts/backup-db.sh` every night at 02:00 UTC. It dumps the
database, compresses it, uploads it to Cloudflare R2, and prunes backups older
than 14 days (configurable via `BACKUP_RETAIN_COUNT` in `.env`).

### Run a backup manually

Useful immediately after first deploy, or before a risky migration.

```bash
ssh user@your-vps-ip
cd /var/www/spiritans
set -a && source .env && set +a
bash scripts/backup-db.sh
```

### Verify the cron is registered

```bash
crontab -l
```

You should see a line like:

```
0 2 * * * cd /var/www/spiritans && bash scripts/backup-db.sh >> /var/log/payload-backup.log 2>&1
```

---

## Restoring from backup

### Standard restore (fresh database)

Use this after a fresh install, or if the database is empty.

```bash
ssh user@your-vps-ip
cd /var/www/spiritans
set -a && source .env && set +a

# Restore the latest backup
bash scripts/restore-db.sh

# Or restore a specific backup by filename
bash scripts/restore-db.sh backup-2026-06-08T02-00-00Z.sql.gz
```

### Restore over an existing database

Use this after data corruption or a bad migration. Drops and recreates the
database before restoring.

```bash
ssh user@your-vps-ip
cd /var/www/spiritans
set -a && source .env && set +a

# Drop and recreate the database
docker exec spiritans-postgres psql -U "$POSTGRES_USER" -d postgres \
  -c "DROP DATABASE $POSTGRES_DB;"
docker exec spiritans-postgres psql -U "$POSTGRES_USER" -d postgres \
  -c "CREATE DATABASE $POSTGRES_DB;"

# Restore
bash scripts/restore-db.sh

# Restart the app so Payload reconnects
pm2 restart spiritans
```

---

## Useful commands

```bash
# App status and logs
pm2 status
pm2 logs spiritans
pm2 logs spiritans --lines 100

# Restart app
pm2 restart spiritans

# Database container
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs postgres

# List available backups in R2
set -a && source .env && set +a
AWS_ACCESS_KEY_ID=$S3_ACCESS_KEY_ID \
AWS_SECRET_ACCESS_KEY=$S3_SECRET_ACCESS_KEY \
AWS_DEFAULT_REGION=auto \
aws s3 ls s3://$S3_BUCKET/db-backups/ --endpoint-url $S3_ENDPOINT | sort
```
