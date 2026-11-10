import { icon, body, line } from '../src/dsl.mjs';
import { rotateD } from '../src/geo.mjs';

const BLADE = 'M12 2.5c1.6 0 2.5 1.2 2.5 2.5v2.5c0 .8-.6 1.5-1.5 1.5h-2c-.9 0-1.5-.7-1.5-1.5V5c0-1.3.9-2.5 2.5-2.5Z';
const BLADE2 = 'M12 21.5c-1.6 0-2.5-1.2-2.5-2.5v-2.5c0-.8.6-1.5 1.5-1.5h2c.9 0 1.5.7 1.5 1.5V19c0 1.3-.9 2.5-2.5 2.5Z';

export default {
  category: 'sports',
  icons: [
    icon('snorkel', 'Snorkel', ['diving mask', 'snorkelling', 'swim', 'underwater', 'beach'], [body('M6.5 8.5h7a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3H12l-1.5-1.5L9 15.5H6.5a3 3 0 0 1-3-3v-1a3 3 0 0 1 3-3Z'), line('M16.5 12h2'), line('M18.5 19V5.5A1.5 1.5 0 0 0 17 4h-.5M18.5 19a1.5 1.5 0 0 1-1.5 1.5h-1')], { noAccent: true }),
  ],
};
