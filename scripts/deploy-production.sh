#!/usr/bin/env bash
# Deploy current main to the public carmakler.cz server checkout.
set -euo pipefail

PRODUCTION_HOST="${PRODUCTION_HOST:-root@91.98.203.239}"
PRODUCTION_PATH="${PRODUCTION_PATH:-/var/www/carmakler}"
PM2_NAME="${PM2_NAME:-carmakler}"
BASE_URL="${BASE_URL:-https://carmakler.cz}"

if [[ "${CONFIRM_PRODUCTION_DEPLOY:-}" != "1" ]]; then
  echo "Refusing production deploy without CONFIRM_PRODUCTION_DEPLOY=1" >&2
  exit 2
fi

echo "==> git push origin main"
git push origin main

echo "==> remote pull + install + build + pm2 reload (${PM2_NAME})"
ssh "$PRODUCTION_HOST" "REMOTE_PATH='$PRODUCTION_PATH' PM2_APP='$PM2_NAME' bash -s" <<'REMOTE'
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

echo "==> production deploy done"
