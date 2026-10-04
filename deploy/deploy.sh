#!/usr/bin/env bash
# Build the website on the VPS and publish it to the Nginx web root without downtime.
# Usage (on the VPS):  bash deploy/deploy.sh
set -euo pipefail

REPO_DIR="${REPO_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
WEB_ROOT="${WEB_ROOT:-/var/www/nexgencode.in/html}"

cd "$REPO_DIR"
echo "==> Updating code in $REPO_DIR"
git pull --ff-only

echo "==> Installing dependencies"
npm ci

echo "==> Building (client + SSR prerender)"
npm run build

echo "==> Sanity checks"
grep -q '<div id="root" data-prerendered="/"' dist/index.html || { echo "dist/index.html is not prerendered"; exit 1; }
grep -q 'data-prerendered="/services/school-erp"' dist/services/school-erp/index.html || { echo "service pages missing"; exit 1; }
if grep -rqE '@vite/client|@react-refresh' dist --include='*.html'; then echo "dev-server scripts found in dist"; exit 1; fi

echo "==> Publishing to $WEB_ROOT"
sudo mkdir -p "$WEB_ROOT"
# New hashed assets first, then HTML, then remove files from older builds
sudo rsync -a dist/assets/ "$WEB_ROOT/assets/"
sudo rsync -a --delete-after --delay-updates dist/ "$WEB_ROOT/"
sudo chown -R www-data:www-data "$WEB_ROOT"

echo "==> Reloading Nginx"
sudo nginx -t
sudo systemctl reload nginx

echo "Done: https://nexgencode.in"
