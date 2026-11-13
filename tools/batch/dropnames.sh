# Remove specific NEW (untracked) icons by name: bash tools/batch/dropnames.sh name...  (refuses tracked names)
R=$(cd "$(dirname "$0")/../.." && pwd); cd "$R"
for n in "$@"; do
  if git ls-files --error-unmatch "packages/assets/icons/$n/meta.json" >/dev/null 2>&1; then echo "SKIP tracked $n"; continue; fi
  for f in $(grep -l "icon('$n'," packages/forge/defs/*.mjs); do sed -i "/icon('$n',/d" "$f"; done
  rm -rf "packages/assets/icons/$n"; echo "$n" >> tools/batch/drop.txt; echo "dropped $n"
done
