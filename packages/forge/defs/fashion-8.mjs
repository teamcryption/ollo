import { R } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'fashion',
  icons: [
    icon('spool', 'Thread Spool', ['thread', 'sewing', 'bobbin', 'yarn', 'craft', 'tailor'], [body(R(7, 6, 10, 12, 0)), line('M7 10l10-2.5M7 14l10-2.5M7 18l10-2.5'), body(R(5, 3.5, 14, 2.5, 1.2)), body(R(5, 18, 14, 2.5, 1.2))], { noAccent: true }),
  ],
};
