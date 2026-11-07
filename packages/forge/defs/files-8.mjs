import { C } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'files',
  icons: [
    icon('database-search', 'Search Database', ['query', 'lookup', 'find records', 'sql query', 'data search'], [body('M4 6c0-1.4 2.5-2.5 5.5-2.5S15 4.6 15 6v9c0 1.4-2.5 2.5-5.5 2.5S4 16.4 4 15Z'), line('M4.2 6.3c.6 1.2 2.7 2.2 5.3 2.2s4.7-1 5.3-2.2'), line('M4.2 10.8c.6 1.2 2.7 2.2 5.3 2.2'), line(C(16.5, 16, 3), { cover: true }), line('M18.7 18.2l2 2')], { noAccent: true }),
  ],
};
