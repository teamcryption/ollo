import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'sports',
  icons: [
    icon('bike-helmet', 'Bike Helmet', ['cycling helmet', 'safety', 'protection', 'helmet', 'ride'], [body('M3.5 14.5a8.5 8 0 0 1 17 0c0 .8-.7 1.5-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5Z'), line('M9 7.2 10.5 11M15 7.2 13.5 11'), line('M7 16l1.5 3h7L17 16')], { noAccent: true }),
  ],
};
