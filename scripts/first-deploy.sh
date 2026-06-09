#!/bin/bash
# scripts/first-deploy.sh
# Run once on a fresh VPS to set everything up.
# After this, GitHub Actions handles all future deploys.
set -euo pipefail

DEPLOY_DIR="/var/www/spiritans"
REPO_URL="git@github.com:2026-project-femi/spiritans-sounds-fe.git"

# ── System deps ───────────────────────────────────────────────────────────────
echo "[setup] Installing system packages..."
apt-get update -q
apt-get install -y -q git curl nginx certbot python3-certbot-nginx \
  postgresql-client awscli

# ── Node (via fnm) ────────────────────────────────────────────────────────────
echo "[setup] Installing Node 20..."
curl -fsSL https://fnm.vercel.app/install | bash
export PATH="$HOME/.local/share/fnm:$PATH"
eval "$(fnm env)"
fnm install 20
fnm use 20
fnm default 20

# ── pnpm ──────────────────────────────────────────────────────────────────────
echo "[setup] Installing pnpm..."
npm install -g pnpm

# ── PM2 ───────────────────────────────────────────────────────────────────────
echo "[setup] Installing PM2..."
npm install -g pm2
pm2 startup systemd -u root --hp /root   # survives reboots

# ── Docker ────────────────────────────────────────────────────────────────────
echo "[setup] Installing Docker..."
curl -fsSL https://get.docker.com | bash

# ── Clone repo ────────────────────────────────────────────────────────────────
echo "[setup] Cloning repo..."
mkdir -p "$DEPLOY_DIR"
git clone "$REPO_URL" "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# ── .env ──────────────────────────────────────────────────────────────────────
echo "[setup] Copy and fill in .env before continuing."
cp .env.production.template .env
echo "  → Edit $DEPLOY_DIR/.env now, then press ENTER to continue."
read -r

# ── Start database ────────────────────────────────────────────────────────────
echo "[setup] Starting PostgreSQL container..."
docker compose -f docker-compose.prod.yml up -d --wait

# ── Build & start app ─────────────────────────────────────────────────────────
echo "[setup] Installing deps and building..."
pnpm install --frozen-lockfile
pnpm build

echo "[setup] Running initial Payload migrations..."
pnpm payload migrate

echo "[setup] Starting app with PM2..."
pm2 start ecosystem.config.cjs --env production
pm2 save

# ── Cron: daily DB backup ──────────────────────────────────────────────────────
echo "[setup] Installing backup cron (runs at 02:00 UTC)..."
CRON_CMD="0 2 * * * cd $DEPLOY_DIR && bash scripts/backup-db.sh >> /var/log/payload-backup.log 2>&1"
(crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -

echo ""
echo "[setup] ✓ Done. Run: pm2 status"
echo "  Next: configure Nginx + Certbot for your domain."
