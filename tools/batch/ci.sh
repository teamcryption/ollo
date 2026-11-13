# Commit + push batch N: bash tools/batch/ci.sh <N> "<topics>"
N=$1; TOP=$2; R=$(cd "$(dirname "$0")/../.." && pwd); cd "$R"
D=$(git status --short | grep -v tools/batch | grep -c '^ D'); [ "$D" != 0 ] && { echo "ABORT: $D deleted files"; exit 1; }
(cd packages/forge && node --test test/forge.test.mjs 2>&1 | grep -E "^ℹ fail")
C=$(git ls-files --others --exclude-standard packages/assets/icons | cut -d/ -f4 | sort -u | wc -l)
E=$(git log -1 --format=%ae); NM="$(git log -1 --format=%an)"; export GIT_AUTHOR_NAME="$NM" GIT_COMMITTER_NAME="$NM" GIT_AUTHOR_EMAIL=$E GIT_COMMITTER_EMAIL=$E
git add -A 2>/dev/null && git commit -qm "Icons batch $N: $C $TOP icons

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" && git log -1 --format='%h %s'
GIT_TERMINAL_PROMPT=0 timeout 120 git push -q origin icons/batch-1 2>&1 | tail -1; echo "total=$(ls packages/assets/icons | wc -l)"
