#!/usr/bin/env bash
# Deploy current main to the sandbox origin car.zajcon.cz.
set -euo pipefail

SANDBOX_HOST="${SANDBOX_HOST:-root@91.98.203.239}"
SANDBOX_PATH="${SANDBOX_PATH:-/var/www/car.zajcon.cz}"
PM2_NAME="${PM2_NAME:-car-zajcon}"
BASE_URL="${BASE_URL:-https://car.zajcon.cz}"

echo "==> git push origin main"
git push origin main

echo "==> remote pull + install + build + pm2 reload (${PM2_NAME})"
ssh "$SANDBOX_HOST" "REMOTE_PATH='$SANDBOX_PATH' PM2_APP='$PM2_NAME' bash -s" <<'REMOTE'
set -euo pipefail

cd "$REMOTE_PATH"

if ! git diff --quiet -- public/sw.js || [[ -n "$(git ls-files --others --exclude-standard public/sw.js)" ]]; then
  git stash push -m "pre-deploy-public-sw-$(date +%Y%m%d-%H%M%S)" -- public/sw.js || true
fi

git fetch origin main
git pull --ff-only origin main
npm ci
set -a
. ./.env
set +a
npm run build

if pm2 describe "$PM2_APP" > /tmp/carmakler-pm2-describe.txt 2>/dev/null; then
  if grep -q "script path.* /usr/bin/npm" /tmp/carmakler-pm2-describe.txt; then
    pm2 delete "$PM2_APP"
    pm2 start ecosystem.config.cjs --only "$PM2_APP" --update-env
  else
    pm2 startOrReload ecosystem.config.cjs --only "$PM2_APP" --update-env
  fi
else
  pm2 start ecosystem.config.cjs --only "$PM2_APP" --update-env
fi

pm2 save
REMOTE

echo "==> smoke check"
bash scripts/smoke-deploy.sh "$BASE_URL"

echo "==> sandbox deploy done"
