#!/bin/bash
# FIX-047e — Bootstrap upload adresare pro self-hosted upload pipeline (lib/upload.ts).
#
# Idempotentni. Vytvori /var/www/uploads + vychozi subfoldery (vehicles, parts,
# contracts, avatars, listings), nastavi vlastnika www-data:www-data a mode 755.
# lib/upload.ts sam vytvari hlubsi podadresare recursive, takze staci zakladni tree.
#
# Pouziti:
#   # Lokalne (s sudo):
#   sudo bash scripts/bootstrap-upload-dir.sh
#
#   # Vzdalene na sandbox:
#   ssh root@91.98.203.239 'bash -s' < scripts/bootstrap-upload-dir.sh
#
# Env (nepovinne):
#   UPLOAD_DIR     default /var/www/uploads
#   UPLOAD_OWNER   default www-data:www-data

set -euo pipefail

UPLOAD_DIR="${UPLOAD_DIR:-/var/www/uploads}"
UPLOAD_OWNER="${UPLOAD_OWNER:-www-data:www-data}"

echo "[bootstrap-upload-dir] target: $UPLOAD_DIR (owner: $UPLOAD_OWNER)"

if ! id -u "${UPLOAD_OWNER%%:*}" >/dev/null 2>&1; then
  echo "[bootstrap-upload-dir] ERROR: user ${UPLOAD_OWNER%%:*} neexistuje" >&2
  exit 1
fi

mkdir -p \
  "$UPLOAD_DIR/carmakler/vehicles" \
  "$UPLOAD_DIR/carmakler/listings" \
  "$UPLOAD_DIR/carmakler/contracts" \
  "$UPLOAD_DIR/carmakler/avatars" \
  "$UPLOAD_DIR/carmakler/parts" \
  "$UPLOAD_DIR/carmakler/onboarding"

chown -R "$UPLOAD_OWNER" "$UPLOAD_DIR"
chmod -R 755 "$UPLOAD_DIR"

echo "[bootstrap-upload-dir] OK — struktura:"
find "$UPLOAD_DIR" -maxdepth 3 -type d | sort
