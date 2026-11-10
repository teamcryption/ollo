// node planadd.cjs '<json {name: {badges:[..]} | {off:true} | {containers:[..]}}>' — merges into variant-plan.mjs, never duplicates a key.
const fs = require('fs'); const p = 'src/variant-plan.mjs'; let s = fs.readFileSync(p, 'utf8'); const nl = s.includes('\r\n') ? '\r\n' : '\n';
const add = JSON.parse(process.argv[2]); const fmt = (v) => JSON.stringify(v).replace(/"/g, "'").replace(/'(\w+)':/g, '$1: ').replace(/,/g, ', ').replace(/{/g, '{ ').replace(/}/g, ' }');
const fresh = [];
for (const [k, v] of Object.entries(add)) {
  const re = new RegExp(`^  '?${k.replace(/-/g, '\-')}'?: \{(.*)\},\s*$`, 'm'); const m = s.match(re);
  if (m) { s = s.replace(re, (line) => line.replace(/ \},\s*$/, `, ${fmt(v).slice(2, -2)} },`)); console.log('merged', k); }
  else fresh.push(`  '${k}': ${fmt(v)},`);
}
if (fresh.length) { const e = s.indexOf('export { OBJ'); const i = s.lastIndexOf('};', e); s = s.slice(0, i) + fresh.join(nl) + nl + s.slice(i); }
fs.writeFileSync(p, s); console.log('added', fresh.length);
