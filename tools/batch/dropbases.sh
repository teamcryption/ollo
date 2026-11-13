# Drop weak derived bases from the current batch and blacklist them: bash tools/batch/dropbases.sh <N> base1 base2 ...
N=$1; shift; R=$(cd "$(dirname "$0")/../.." && pwd); W=$(cd "$R/.." && pwd)/.batchwork; cd "$R"
MODRE=$(tr ',' '|' < tools/batch/good-mods.txt); : > "$W/dropnow.txt"
for b in "$@"; do grep -E "^$b-($MODRE)$" "$W/new$N.txt" >> "$W/dropnow.txt"; echo "$b" >> tools/batch/bad-bases.txt; done
cat "$W/dropnow.txt" >> tools/batch/drop.txt
NEWDEFS=$(git ls-files --others --exclude-standard packages/forge/defs)
node -e "const fs=require('fs');const d=new Set(fs.readFileSync(process.argv[1],'utf8').split(/\s+/).filter(Boolean));let n=0;for(const f of process.argv.slice(2)){const s=fs.readFileSync(f,'utf8').split('\n').filter(l=>{const m=l.match(/icon\('([a-z0-9-]+)'/);if(m&&d.has(m[1])){n++;return false}return true});fs.writeFileSync(f,s.join('\n'))}console.log('removed defs',n)" "$W/dropnow.txt" $NEWDEFS
while read n; do [ -n "$n" ] && rm -rf "packages/assets/icons/$n"; done < "$W/dropnow.txt"
echo "new now: $(git ls-files --others --exclude-standard packages/assets/icons | cut -d/ -f4 | sort -u | wc -l)"
