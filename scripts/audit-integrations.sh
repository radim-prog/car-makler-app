#!/usr/bin/env bash
# Print integration readiness without exposing secret values.
set -euo pipefail

ENV_FILE="${1:-${ENV_FILE:-.env.local}}"
STRICT="${STRICT:-0}"
MISSING_CRITICAL=0
declare -A FILE_ENV=()

if [[ ! -r "$ENV_FILE" && -r ".env" ]]; then
  ENV_FILE=".env"
fi

trim() {
  local value="$1"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"
  printf '%s' "$value"
}

if [[ -r "$ENV_FILE" ]]; then
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="$(trim "$line")"
    [[ -z "$line" || "$line" == \#* || "$line" != *=* ]] && continue

    key="$(trim "${line%%=*}")"
    value="$(trim "${line#*=}")"

    if [[ "$value" == \#* ]]; then
      value=""
    elif [[ "$value" == \"*\" && "$value" == *\" ]]; then
      value="${value:1:${#value}-2}"
    elif [[ "$value" == \'*\' && "$value" == *\' ]]; then
      value="${value:1:${#value}-2}"
    elif [[ "$value" == *" #"* ]]; then
      value="$(trim "${value%% #*}")"
    fi

    [[ "$key" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]] && FILE_ENV["$key"]="$value"
  done < "$ENV_FILE"
else
  echo "[integrations] env file not found: $ENV_FILE"
fi

state() {
  local key="$1"
  local required="${2:-optional}"
  local value
  value="$(value_for "$key")"

  if [[ -n "$value" ]]; then
    echo "[integrations] OK      $key is set"
  elif [[ "$required" == "required" ]]; then
    echo "[integrations] MISSING $key is required"
    MISSING_CRITICAL=1
  else
    echo "[integrations] EMPTY   $key is optional"
  fi
}

value_for() {
  local key="$1"
  printf '%s' "${!key:-${FILE_ENV[$key]:-}}"
}

group() {
  echo
  echo "== $1 =="
}

group "Core"
state DATABASE_URL required
state NEXTAUTH_SECRET required
state NEXTAUTH_URL required
state NEXT_PUBLIC_APP_URL required
state NEXT_PUBLIC_MAIN_URL required
state NEXT_PUBLIC_INZERCE_URL optional
state NEXT_PUBLIC_SHOP_URL optional
state NEXT_PUBLIC_MARKETPLACE_URL optional
state CRON_SECRET required

group "Access"
state SITE_PASSWORD optional
state MARKETPLACE_GATE_DISABLED optional

group "Upload"
state UPLOAD_DIR optional
state UPLOAD_BASE_URL optional
if [[ -n "$(value_for UPLOAD_DIR)" && -n "$(value_for UPLOAD_BASE_URL)" ]]; then
  echo "[integrations] OK      uploads use self-hosted storage"
else
  echo "[integrations] WARN    uploads fall back to placeholder/dev behavior"
fi

group "Email"
state SMTP_HOST optional
state SMTP_PORT optional
state SMTP_USER optional
state SMTP_PASSWORD optional
state SMTP_FROM optional
if [[ -n "$(value_for SMTP_USER)" && -n "$(value_for SMTP_PASSWORD)" ]]; then
  echo "[integrations] OK      SMTP can send transactional email"
else
  echo "[integrations] WARN    SMTP is not configured; sendEmail returns NOT_CONFIGURED"
fi

group "Payments and checks"
state STRIPE_SECRET_KEY optional
state STRIPE_PUBLISHABLE_KEY optional
state STRIPE_WEBHOOK_SECRET optional
state CEBIA_API_URL optional
state CEBIA_API_KEY optional
state ANTHROPIC_API_KEY optional

if [[ "$STRICT" == "1" && "$MISSING_CRITICAL" == "1" ]]; then
  echo
  echo "[integrations] strict mode failed"
  exit 1
fi

echo
echo "[integrations] audit complete"
