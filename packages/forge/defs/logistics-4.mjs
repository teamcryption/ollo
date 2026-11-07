import { L } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'logistics',
  icons: [
    icon('fragile', 'Fragile', ['handle with care', 'breakable', 'glass', 'delicate', 'shipping mark'], [body('M7.5 3.5h9l-.6 5.5a3.9 3.9 0 0 1-7.8 0Z'), line(L(12, 13, 12, 19.5)), line(L(8.5, 20.5, 15.5, 20.5)), line('M12.5 4.5l-1.5 2.3 2 1-1.2 2')], { noAccent: true }),
  ],
};
