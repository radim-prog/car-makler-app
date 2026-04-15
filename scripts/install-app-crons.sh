#!/usr/bin/env bash
# Install self-hosted cron calls for app maintenance endpoints.
set -euo pipefail

APP_BASE_URL="${APP_BASE_URL:-https://car.zajcon.cz}"
APP_ENV_FILE="${APP_ENV_FILE:-/var/www/car.zajcon.cz/.env}"
CRON_FILE="${CRON_FILE:-/etc/cron.d/carmakler-app-crons}"
CRON_USER="${CRON_USER:-root}"
LOG_FILE="${LOG_FILE:-/var/log/carmakler-app-cron.log}"

if [[ "$EUID" -ne 0 ]]; then
  echo "Run as root so the script can write $CRON_FILE" >&2
  exit 1
fi

if [[ ! -r "$APP_ENV_FILE" ]]; then
  echo "Env file is not readable: $APP_ENV_FILE" >&2
  exit 1
fi

if [[ "$APP_BASE_URL" != http://* && "$APP_BASE_URL" != https://* ]]; then
  APP_BASE_URL="https://${APP_BASE_URL}"
fi
APP_BASE_URL="${APP_BASE_URL%/}"

install -m 0644 /dev/null "$CRON_FILE"

cat > "$CRON_FILE" <<CRON
# Managed by car-makler-app/scripts/install-app-crons.sh
# Source env: $APP_ENV_FILE
# Logs: $LOG_FILE
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

*/15 * * * * $CRON_USER flock -n /tmp/carmakler-cron-reservation.lock bash -lc 'set -a; . "$APP_ENV_FILE"; set +a; test -n "\${CRON_SECRET:-}"; curl -fsS --max-time 60 -H "Authorization: Bearer \${CRON_SECRET}" "$APP_BASE_URL/api/cron/reservation-expiry" >> "$LOG_FILE" 2>&1'
*/10 * * * * $CRON_USER flock -n /tmp/carmakler-cron-watchdog.lock bash -lc 'set -a; . "$APP_ENV_FILE"; set +a; test -n "\${CRON_SECRET:-}"; curl -fsS --max-time 60 -H "Authorization: Bearer \${CRON_SECRET}" "$APP_BASE_URL/api/cron/watchdog-match" >> "$LOG_FILE" 2>&1'
0 * * * * $CRON_USER flock -n /tmp/carmakler-cron-sla.lock bash -lc 'set -a; . "$APP_ENV_FILE"; set +a; test -n "\${CRON_SECRET:-}"; curl -fsS --max-time 60 -H "Authorization: Bearer \${CRON_SECRET}" "$APP_BASE_URL/api/cron/sla-check" >> "$LOG_FILE" 2>&1'
10 3 * * * $CRON_USER flock -n /tmp/carmakler-cron-listing-expiry.lock bash -lc 'set -a; . "$APP_ENV_FILE"; set +a; test -n "\${CRON_SECRET:-}"; curl -fsS --max-time 120 -H "Authorization: Bearer \${CRON_SECRET}" "$APP_BASE_URL/api/cron/listing-expiry" >> "$LOG_FILE" 2>&1'
20 3 * * * $CRON_USER flock -n /tmp/carmakler-cron-quick-draft.lock bash -lc 'set -a; . "$APP_ENV_FILE"; set +a; test -n "\${CRON_SECRET:-}"; curl -fsS --max-time 120 -H "Authorization: Bearer \${CRON_SECRET}" "$APP_BASE_URL/api/cron/quick-draft-expiry" >> "$LOG_FILE" 2>&1'
30 3 * * * $CRON_USER flock -n /tmp/carmakler-cron-exclusive.lock bash -lc 'set -a; . "$APP_ENV_FILE"; set +a; test -n "\${CRON_SECRET:-}"; curl -fsS --max-time 120 -H "Authorization: Bearer \${CRON_SECRET}" "$APP_BASE_URL/api/cron/exclusive-expiry" >> "$LOG_FILE" 2>&1'
40 3 * * * $CRON_USER flock -n /tmp/carmakler-cron-stale.lock bash -lc 'set -a; . "$APP_ENV_FILE"; set +a; test -n "\${CRON_SECRET:-}"; curl -fsS --max-time 120 -H "Authorization: Bearer \${CRON_SECRET}" "$APP_BASE_URL/api/cron/stale-vehicles" >> "$LOG_FILE" 2>&1'
50 3 * * * $CRON_USER flock -n /tmp/carmakler-cron-upsell.lock bash -lc 'set -a; . "$APP_ENV_FILE"; set +a; test -n "\${CRON_SECRET:-}"; curl -fsS --max-time 120 -H "Authorization: Bearer \${CRON_SECRET}" "$APP_BASE_URL/api/cron/upsell-check" >> "$LOG_FILE" 2>&1'
5 4 * * * $CRON_USER flock -n /tmp/carmakler-cron-erasure.lock bash -lc 'set -a; . "$APP_ENV_FILE"; set +a; test -n "\${CRON_SECRET:-}"; curl -fsS --max-time 180 -H "Authorization: Bearer \${CRON_SECRET}" "$APP_BASE_URL/api/cron/process-erasures" >> "$LOG_FILE" 2>&1'
15 4 * * * $CRON_USER flock -n /tmp/carmakler-cron-feed.lock bash -lc 'set -a; . "$APP_ENV_FILE"; set +a; test -n "\${CRON_SECRET:-}"; curl -fsS --max-time 300 -H "Authorization: Bearer \${CRON_SECRET}" "$APP_BASE_URL/api/cron/feed-import?frequency=DAILY" >> "$LOG_FILE" 2>&1'
0 7 * * * $CRON_USER flock -n /tmp/carmakler-cron-daily-summary.lock bash -lc 'set -a; . "$APP_ENV_FILE"; set +a; test -n "\${CRON_SECRET:-}"; curl -fsS --max-time 300 -X POST -H "Authorization: Bearer \${CRON_SECRET}" "$APP_BASE_URL/api/cron/daily-summary" >> "$LOG_FILE" 2>&1'
CRON

chmod 0644 "$CRON_FILE"
touch "$LOG_FILE"
chmod 0644 "$LOG_FILE"

echo "Installed $CRON_FILE for $APP_BASE_URL"
systemctl reload cron 2>/dev/null || systemctl reload crond 2>/dev/null || true
