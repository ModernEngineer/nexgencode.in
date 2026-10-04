#!/usr/bin/env bash
# Deploy NexGenCode on the VPS: pull code, build + publish the website and the .NET API, restart services.
# Usage (on the VPS, from the repo folder):
#   bash deploy/deploy.sh            # website + API
#   bash deploy/deploy.sh --web      # website only
#   bash deploy/deploy.sh --api      # API only
set -euo pipefail

REPO_DIR="${REPO_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
WEB_ROOT="${WEB_ROOT:-/var/www/nexgencode.in/html}"
API_DIR="${API_DIR:-/var/www/nexgencode.in/api}"
API_SERVICE="${API_SERVICE:-nexgencode-api}"

DO_WEB=1; DO_API=1
case "${1:-}" in
  --web) DO_API=0 ;;
  --api) DO_WEB=0 ;;
  "") ;;
  *) echo "Unknown option: $1 (use --web or --api)"; exit 1 ;;
esac

cd "$REPO_DIR"
echo "==> Updating code in $REPO_DIR"
git pull --ff-only

if [[ $DO_API == 1 ]]; then
  echo "==> Publishing API"
  PUBLISH_DIR="$(mktemp -d)"
  dotnet publish backend/NexGenCode.Api -c Release -o "$PUBLISH_DIR" --nologo
  sudo mkdir -p "$API_DIR/wwwroot/uploads"
  # Keep uploaded images (wwwroot/uploads) — never delete them on deploy
  sudo rsync -a --delete --exclude 'wwwroot/uploads/' "$PUBLISH_DIR/" "$API_DIR/"
  sudo chown -R www-data:www-data "$API_DIR"
  rm -rf "$PUBLISH_DIR"
  echo "==> Restarting $API_SERVICE (applies database migrations on startup)"
  sudo systemctl restart "$API_SERVICE"
  for i in $(seq 1 30); do
    if curl -fsS http://127.0.0.1:5080/api/health >/dev/null 2>&1; then echo "API is up"; break; fi
    if [[ $i == 30 ]]; then echo "API did not start — check: sudo journalctl -u $API_SERVICE -n 50"; exit 1; fi
    sleep 1
  done
fi

if [[ $DO_WEB == 1 ]]; then
  echo "==> Installing website dependencies"
  npm ci
  echo "==> Building website (client + SSR prerender)"
  npm run build

  echo "==> Sanity checks"
  grep -q '<div id="root" data-prerendered="/"' dist/index.html || { echo "dist/index.html is not prerendered"; exit 1; }
  grep -q 'data-prerendered="/services/school-erp"' dist/services/school-erp/index.html || { echo "service pages missing"; exit 1; }
  if grep -rqE '@vite/client|@react-refresh' dist --include='*.html'; then echo "dev-server scripts found in dist"; exit 1; fi

  echo "==> Publishing website to $WEB_ROOT"
  sudo mkdir -p "$WEB_ROOT"
  # New hashed assets first, then HTML, then remove files from older builds
  sudo rsync -a dist/assets/ "$WEB_ROOT/assets/"
  sudo rsync -a --delete-after --delay-updates dist/ "$WEB_ROOT/"
  sudo chown -R www-data:www-data "$WEB_ROOT"

  echo "==> Reloading Nginx"
  sudo nginx -t
  sudo systemctl reload nginx
fi

echo "Done: https://nexgencode.in"
