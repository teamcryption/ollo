# Single-pass bulk batch (run from packages/forge): BULK_MAX=600 BULK_MODS=... bash ../../tools/batch/runbulk1.sh
# Writes defs, generates once with DROP_FILE so QA offenders are dropped instead of blocking, then removes the
# dropped icons' def lines and records them in drop.txt. Paths are passed as arguments/env so MSYS converts them on Windows.
T=$(cd "$(dirname "$0")" && pwd)
export BULK_DROP=$T/drop.txt; touch $BULK_DROP
rm -f /tmp/bulk-dropped.txt
git ls-files --others --exclude-standard defs | xargs -r rm -f
node $T/writebatch.mjs defs $T/bulk.mjs | tail -1
NEWDEFS=$(git ls-files --others --exclude-standard defs)
grep -ohE "icon\('[a-z0-9-]+'" $NEWDEFS | sed "s/icon('//; s/'//" > /tmp/bulk-new.txt
echo "candidates $(wc -l < /tmp/bulk-new.txt)"
FAST=1 DROP_FILE=/tmp/bulk-new.txt DROPPED_OUT=/tmp/bulk-dropped.txt node src/generate.mjs > /tmp/gen.log 2>&1; RC=$?
grep -a "^dropped" /tmp/gen.log
if [ -s /tmp/bulk-dropped.txt ]; then
  cat /tmp/bulk-dropped.txt >> $BULK_DROP
  node -e "const fs=require('fs');const d=new Set(fs.readFileSync(process.argv[1],'utf8').split(/\s+/).filter(Boolean));let n=0;for(const f of process.argv.slice(2)){const s=fs.readFileSync(f,'utf8').split('\n').filter(l=>{const m=l.match(/icon\('([a-z0-9-]+)'/);if(m&&d.has(m[1])){n++;return false}return true});fs.writeFileSync(f,s.join('\n'))}console.log('removed defs',n)" /tmp/bulk-dropped.txt $NEWDEFS
fi
[ $RC = 0 ] && echo "OK single pass" || { echo "FAILED rc=$RC"; grep -a -A8 "QA errors" /tmp/gen.log | head -10; }
