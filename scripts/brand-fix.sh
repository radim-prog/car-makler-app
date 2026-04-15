#!/usr/bin/env bash
# F-046 / FIX-034b — Brand konzistence CarMakler → CarMakléř
#
# Hromadná náhrada user-facing výskytů `Carmakler` a `CarMakler` na `CarMakléř`.
# Chrání technické identifikátory (doména, storage keys, IDB, npm scope, DB jméno).
#
# Spustit z root projektu: bash scripts/brand-fix.sh
#
# Po běhu ověřit:
#   grep -rEn '\b[Cc]armakler\b' app/ components/ lib/ --include='*.tsx' --include='*.ts'
#     → musí vrátit pouze technické výskyty (audit §6)
set -euo pipefail

cd "$(dirname "$0")/.."

# Seznam souborů: obsahují Carmakler/CarMakler (word boundary),
# ale vyloučené ty, kde je to jen technický identifikátor.
FILES=$(grep -rlE '\b[Cc]armakler\b' \
    app/ components/ lib/ \
    --include='*.tsx' --include='*.ts' --include='*.html' --include='*.md' 2>/dev/null || true)

if [ -z "$FILES" ]; then
  echo "No files to process."
  exit 0
fi

echo "Processing $(echo "$FILES" | wc -l) files..."

for f in $FILES; do
  # Náhrada se word-boundary — nedotkne se:
  #   carmakler.cz (doména, lowercase)
  #   carmakler_* (storage keys, DB jméno)
  #   carmakler-offline / carmakler-install-dismissed / carmakler-data-export / carmakler-eshop / carmakler-dily-sablona
  #   @carmakler/* (npm scope)
  #   CarmaklerDB (TS interface — ochráníme dole při post-fix revert, pokud by to někdo chytil)
  sed -i 's/\bCarmakler\b/CarMakléř/g; s/\bCarMakler\b/CarMakléř/g' "$f"
done

# Revert TS interface — `CarmaklerDB` v lib/offline/db.ts je TS typ, nesmí se změnit.
if [ -f lib/offline/db.ts ]; then
  sed -i 's/\bCarMakléřDB\b/CarmaklerDB/g' lib/offline/db.ts
fi

# Email template typo fix (kódový lint z hardcoded HTML bez háčků):
if [ -f app/api/invitations/route.ts ]; then
  sed -i 's/\bPozvanka\b/Pozvánka/g' app/api/invitations/route.ts
  sed -i 's/\bmaklerskesiti\b/makléřské síti/g' app/api/invitations/route.ts
fi

echo "Done."
