import { loadAll } from './load.mjs';

const { icons, illustrations, errors } = loadAll();
if (errors.length) {
  console.error(`${errors.length} problem(s):\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log(`OK - ${icons.length} icons, ${illustrations.length} illustrations`);
