import { icon, body, line } from '../src/dsl.mjs';
import { C, D } from '../src/geo.mjs';

export default {
  category: 'animals',
  icons: [
    icon('whale-tail', 'Whale Tail', ['whale', 'fluke', 'ocean', 'marine', 'whale watching'], [body('M12 13c-1-3-1.5-5-4.5-7-1.5-1-4-.8-4.5.5 2.5 0 4 1.5 5 3.5 1 2.2 2 3 4 3s3-.8 4-3c1-2 2.5-3.5 5-3.5-.5-1.3-3-1.5-4.5-.5-3 2-3.5 4-4.5 7Z'), line('M12 13v3.5'), line('M3.5 18.5c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 2.2.7 3 .3')], { noAccent: true }),
  ],
};
