# Server Database Disaster Recovery Playbook

## 1. Automated Daily Backups
Your Cloudflare R2 backups run automatically via cron. 
*Note:* If your `.env` file contains complex multi-line strings (like SSH keys), the standard `source .env` command may fail. To perfectly bypass this, the cronjob explicitly passes only the required variables inline.

**To verify or edit the cron job:**
```bash
crontab -e
```
Ensure you have a line at the bottom similar to:
```bash
0 3 * * * POSTGRES_URL="<your_db_url>" S3_BUCKET="<your_bucket>" S3_ENDPOINT="<your_endpoint>" S3_ACCESS_KEY_ID="<your_key>" S3_SECRET_ACCESS_KEY="<your_secret>" /var/www/spiritans/scripts/backup-db.sh >> /var/log/spiritans-db-backup.log 2>&1
```

---

## 2. Restoring the Database
In the event of database corruption, accidental deletion, or server failure, you can use `.scripts/restore-db.sh` to seamlessly overwrite the database with the absolute newest backup sitting safely in Cloudflare R2.

### Step 1: SSH into your Hetzner Server
```bash
cd /var/www/spiritans
```

### Step 2: Load environment variables
Load your Cloudflare keys locally so the script can safely authenticate:
```bash
export POSTGRES_URL="postgresql://user:pass@127.0.0.1:5432/spiritans_prod"
export S3_BUCKET="mike-test-cloudflare-bucket"
export S3_ENDPOINT="https://<account-id>.r2.cloudflarestorage.com"
export S3_ACCESS_KEY_ID="<your_key>"
export S3_SECRET_ACCESS_KEY="<your_secret>"
```
*(Alternatively, if your `.env` is clean and contains no syntax errors, you can run `set -a; source .env; set +a`)*

### Step 3: Run the Restore Script

**Option A: 1-Click Absolute Latest Backup**
If your database broke today and you just want yesterday's backup:
```bash
./scripts/restore-db.sh
```
*(The script will automatically reach into Cloudflare R2, find the newest file, download it to `/tmp`, inject it into your Postgres database, and delete the temp file!).*

**Option B: Restore a specific older backup**
If the damage happened 3 days ago, you can look inside your Cloudflare R2 dashboard, find the exact filename, and pass it directly to the script:
```bash
./scripts/restore-db.sh backup-2026-06-08T03-00-00Z.sql.gz
```

### Step 4: Restart the Application
Once the terminal outputs `[restore] Restore complete`, bounce the Payload instance to clear any cached states:
```bash
pm2 restart spiritans
```
