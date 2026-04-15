#!/usr/bin/env bash
# Fast HTTP smoke test for a deployed CarMakler origin.
set -euo pipefail

BASE_URL="${1:-https://car.zajcon.cz}"
TIMEOUT="${SMOKE_TIMEOUT:-20}"
RETRIES="${SMOKE_RETRIES:-12}"
RETRY_SLEEP="${SMOKE_RETRY_SLEEP:-2}"
BODY_FILE="$(mktemp)"

trap 'rm -f "$BODY_FILE"' EXIT

if [[ "$BASE_URL" != http://* && "$BASE_URL" != https://* ]]; then
  BASE_URL="https://${BASE_URL}"
fi

BASE_URL="${BASE_URL%/}"
SCHEME="${BASE_URL%%://*}"
HOST="${BASE_URL#http://}"
HOST="${HOST#https://}"
HOST="${HOST%%/*}"

fail() {
  echo "[smoke] FAIL: $*" >&2
  exit 1
}

check_status() {
  local url="$1"
  local status
  local attempt

  for attempt in $(seq 1 "$RETRIES"); do
    if status="$(curl -L -sS --max-time "$TIMEOUT" -o "$BODY_FILE" -w "%{http_code}" "$url")"; then
      if [[ "$status" -ge 200 && "$status" -lt 400 ]]; then
        echo "[smoke] OK $status $url"
        return 0
      fi
    else
      status="000"
    fi

    echo "[smoke] wait $attempt/$RETRIES $url returned HTTP $status"
    sleep "$RETRY_SLEEP"
  done

  cat "$BODY_FILE" >&2 || true
  fail "$url did not become healthy"
}

check_contains() {
  local url="$1"
  local needle="$2"

  check_status "$url"
  if ! grep -Fq "$needle" "$BODY_FILE"; then
    fail "$url does not contain expected text: $needle"
  fi
}

check_contains "$BASE_URL/" "CarMak"
check_contains "$BASE_URL/gate" "Web je"
check_status "$BASE_URL/nabidka"
check_status "$BASE_URL/pro-bazary"
check_status "$BASE_URL/pro-autickare"
check_status "$BASE_URL/pro-investory"
check_status "$BASE_URL/pro-makleri"
check_status "$BASE_URL/shop"
check_status "$BASE_URL/marketplace"

if [[ "$HOST" != localhost* && "$HOST" != 127.* && "$HOST" != *:* ]]; then
  SUBDOMAIN_ROOT="$HOST"

  check_status "${SCHEME}://inzerce.${SUBDOMAIN_ROOT}/"
  check_status "${SCHEME}://shop.${SUBDOMAIN_ROOT}/"
  check_status "${SCHEME}://marketplace.${SUBDOMAIN_ROOT}/"
fi

echo "[smoke] all checks passed for $BASE_URL"
