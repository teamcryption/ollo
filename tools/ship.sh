#!/bin/bash
# Ship one icon batch: build, test, type-check, commit, refresh the review page.
# Usage (from anywhere in the repo):
#   tools/ship.sh "Icons batch N: <count> <topics> icons" "Adds a, b, c in all five styles."
# Env: REVIEW_DIR (default ./.review) - folder the review page is written to (publish it as an artifact).
#      BUNDLE (optional) - path to write a `git bundle --all` backup to.
#      COMMIT_TRAILER (optional) - attribution lines appended to the commit message.
# Keep the subject format: packages/forge/src/review.mjs parses "batch N" for the Latest batch view.
set -euo pipefail
ROOT=$(git rev-parse --show-toplevel)
REVIEW_DIR=${REVIEW_DIR:-$ROOT/.review}
cd "$ROOT/packages"
pnpm --filter @library/build build 2>&1 | tail -1
pnpm --filter @library/build test 2>&1 | grep -E "^# (pass|fail)"
(cd forge && node --test test/forge.test.mjs 2>&1 | grep -E "^# (pass|fail)")
(cd react && npx tsc --noEmit && echo "tsc ok")
cd "$ROOT"
git add -A
MSG="$1

$2"
[ -n "${COMMIT_TRAILER:-}" ] && MSG="$MSG

$COMMIT_TRAILER"
git commit -q -m "$MSG"
git log --oneline -1
[ -n "${BUNDLE:-}" ] && git bundle create "$BUNDLE" --all >/dev/null 2>&1 && echo "bundle ok"
mkdir -p "$REVIEW_DIR"
(cd packages/forge && node src/review.mjs "$REVIEW_DIR/index.html")
echo "icons: $(ls packages/assets/icons | wc -l)"
