import { icon, body, line } from '../src/dsl.mjs';
import { R, C, D } from '../src/geo.mjs';

export default {
  category: 'finance',
  icons: [
    icon('investment', 'Investment', ['grow money', 'invest', 'returns', 'savings growth', 'sprout'], [body(C(12, 16, 4.5)), line('M12 14.3v3.4'), line('M12 11.5V8'), body('M12 8c0-2.5 1.8-4.3 4.5-4.5.2 2.7-1.8 4.5-4.5 4.5Z'), body('M12 9.5c0-2-1.5-3.5-3.8-3.7-.2 2.2 1.5 3.7 3.8 3.7Z')], { noAccent: true }),
  ],
};
