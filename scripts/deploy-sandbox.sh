#!/usr/bin/env bash
# Deploy aktuální main do sandboxu car.zajcon.cz.
# Použití: scripts/deploy-sandbox.sh    (spustit po každém commitu/série commitů)
set -euo pipefail

SANDBOX_HOST="root@91.98.203.239"
SANDBOX_PATH="/var/www/car.zajcon.cz"
PM2_NAME="car-zajcon"

echo "==> git push origin main"
git push origin main

echo "==> remote pull + build + pm2 restart"
ssh "${SANDBOX_HOST}" "cd ${SANDBOX_PATH} && git pull --ff-only && set -a && . ./.env && set +a && npm run build && pm2 restart ${PM2_NAME} --update-env"

echo "==> smoke check (retry up to 10x, 2s interval)"
for i in $(seq 1 10); do
  if curl -sfI "https://car.zajcon.cz/" -o /dev/null; then
    echo "✅ deploy done (smoke OK po ${i}. pokusu)"
    exit 0
  fi
  sleep 2
done
echo "❌ smoke check failed po 10 pokusech"
exit 1
