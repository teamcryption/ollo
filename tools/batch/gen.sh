# Bulk batch N: bash tools/batch/gen.sh <N> [max]  (env BULK_ORDER=base recommended). Work files in ../.batchwork.
N=$1; MAX=${2:-1200}; R=$(cd "$(dirname "$0")/../.." && pwd); W=$(cd "$R/.." && pwd)/.batchwork; mkdir -p "$W"
L=$W/b$N.log; : > "$L"
cd "$R" && GIT_TERMINAL_PROMPT=0 timeout 120 git pull -q --ff-only origin icons/batch-1 >> "$L" 2>&1
cd packages/forge && BULK_MAX=$MAX BULK_MODS=${GEN_MODS:-$(cat ../../tools/batch/good-mods.txt)} bash ../../tools/batch/runbulk1.sh >> "$L" 2>&1
echo "deleted=$(git status --short | grep -v tools/batch | grep -c '^ D')" >> "$L"
cd "$R" && git ls-files --others --exclude-standard packages/assets/icons | cut -d/ -f4 | sort -u > "$W/new$N.txt"
echo "new=$(wc -l < "$W/new$N.txt")" >> "$L"
SAMPLE=$(awk '{b=$0; sub(/-[a-z]+$/,"",b); if(!(b in s)){s[b]=1; print}}' "$W/new$N.txt" | head -52 | paste -sd,)
[ -n "$SAMPLE" ] && node tools/sheet.mjs "$W/s$N.png" "$SAMPLE" >> "$L" 2>&1
echo DONE >> "$L"
