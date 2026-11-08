import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'travel',
  icons: [
    icon('life-jacket', 'Life Jacket', ['life vest', 'buoyancy', 'safety', 'boat', 'swim'], [body('M8 4 4.5 8v12h15V8L16 4h-1.5a2.5 2.5 0 0 1-5 0Z'), line('M12 9.5V20'), line('M4.5 14.5h15')], { noAccent: true }),
  ],
};
