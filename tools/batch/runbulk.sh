# Bulk combo batch: BULK_MAX=330 BULK_MODS=search,clock,... bash ../../tools/batch/runbulk.sh   (run from packages/forge)
# Generates defs from bulk.mjs, drops any QA offenders (added to drop.txt) and retries.
T=$(cd "$(dirname "$0")" && pwd)
export BULK_DROP=$T/drop.txt; touch $BULK_DROP
for i in 1 2 3 4 5 6; do
  git ls-files --others --exclude-standard defs | xargs -r rm -f
  node $T/writebatch.mjs defs $T/bulk.mjs | tail -1
  node src/generate.mjs > /tmp/gen.log 2>&1 && { echo "OK pass $i"; break; }
  bash $T/grab.sh
  echo "pass $i: $(wc -l < /tmp/bad.txt) dropped"; [ -s /tmp/bad.txt ] || { grep -A5 "QA errors" /tmp/gen.log; break; }
  cat /tmp/bad.txt >> $BULK_DROP
done
