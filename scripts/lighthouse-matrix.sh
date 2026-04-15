#!/usr/bin/env bash
# AUDIT-019 Phase 1 — Lighthouse baseline matrix
#
# Iteruje přes 11 URL × mobile/desktop = 22 runs.
# Pro medián přes více runs: opakuj N-krát (RUNS=3 ./scripts/lighthouse-matrix.sh).
#
# Env:
#   BASE_URL   — default https://car.zajcon.cz
#   OUT_DIR    — default .audit-reports/YYYY-MM-DD-baseline
#   RUNS       — default 1 (kolik opakování pro median)
#   LH_COOKIE  — optional cookie (pokud SITE_PASSWORD aktivní)
#
# Výstup: JSON + HTML reports v $OUT_DIR/<slug>-<device>-run<N>.{report.json,report.html}

set -euo pipefail

BASE="${BASE_URL:-https://car.zajcon.cz}"
OUT="${OUT_DIR:-.audit-reports/$(date +%F)-baseline}"
RUNS="${RUNS:-1}"
AUTH_COOKIE="${LH_COOKIE:-}"

URLS=(
  "/"
  "/pro-bazary"
  "/chci-prodat"
  "/pro-dealery"
  "/marketplace"
  "/inzerat/podat"
  "/admin/login"
  "/broker/dashboard"
  "/shop"
  "/dily"
  "/404"
)

DEVICES=("desktop" "mobile")
mkdir -p "$OUT"

TOTAL=$(( ${#URLS[@]} * ${#DEVICES[@]} * RUNS ))
I=0

for url in "${URLS[@]}"; do
  for dev in "${DEVICES[@]}"; do
    for run in $(seq 1 "$RUNS"); do
      I=$((I+1))
      slug="$(echo "$url" | sed 's|/|_|g; s|^_||; s|^$|home|')"
      [[ -z "$slug" ]] && slug="home"
      file="$OUT/${slug}-${dev}-run${run}"

      extra_args=()
      [[ -n "$AUTH_COOKIE" ]] && extra_args+=(--extra-headers="{\"Cookie\":\"$AUTH_COOKIE\"}")
      preset_arg=()
      [[ "$dev" == "desktop" ]] && preset_arg+=(--preset=desktop)

      echo ">>> [$I/$TOTAL] $BASE$url ($dev, run $run)"
      npx --yes lighthouse "$BASE$url" \
        "${preset_arg[@]}" \
        --output=json --output=html \
        --output-path="$file" \
        --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage --disable-gpu" \
        --only-categories=performance \
        --quiet \
        "${extra_args[@]}" \
        2>&1 | tail -3 || echo "FAIL $url $dev run$run"
    done
  done
done

echo ""
echo ">>> DONE. Reports v: $OUT"
ls "$OUT" | wc -l
