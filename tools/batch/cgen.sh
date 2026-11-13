# Container batch N: bash tools/batch/cgen.sh <N> [iconCount]
N=$1; CNT=${2:-600}; export CB_ALL=${CB_ALL:-1}; R=$(cd "$(dirname "$0")/../.." && pwd); W=$(cd "$R/.." && pwd)/.batchwork; mkdir -p "$W"; L=$W/b$N.log; : > "$L"
cd "$R" && GIT_TERMINAL_PROMPT=0 timeout 120 git pull -q --ff-only origin icons/batch-1 >> "$L" 2>&1
cd packages/forge && rm -f "$W/dropped.txt"
node ../../tools/batch/cbatch.mjs pick $CNT "$W/newnames.txt" >> "$L" 2>&1
FAST=1 DROP_FILE="$W/newnames.txt" DROPPED_OUT="$W/dropped.txt" node src/generate.mjs > "$W/gen.log" 2>&1; RC=$?
grep -a "^dropped" "$W/gen.log" >> "$L"
[ -s "$W/dropped.txt" ] && node ../../tools/batch/cbatch.mjs prune "$W/dropped.txt" >> "$L" 2>&1
[ $RC = 0 ] && echo "OK single pass" >> "$L" || { echo "FAILED rc=$RC" >> "$L"; grep -a -A8 "QA errors" "$W/gen.log" | head -10 >> "$L"; }
echo "deleted=$(git status --short | grep -v tools/batch | grep -c '^ D')" >> "$L"
cd "$R" && git ls-files --others --exclude-standard packages/assets/icons | cut -d/ -f4 | sort -u > "$W/new$N.txt"
echo "new=$(wc -l < "$W/new$N.txt")" >> "$L"
SAMPLE=$(awk 'NR%23==1' "$W/new$N.txt" | head -40 | paste -sd,); [ -n "$SAMPLE" ] && node tools/sheet.mjs "$W/s$N.png" "$SAMPLE" >> "$L" 2>&1
echo DONE >> "$L"
