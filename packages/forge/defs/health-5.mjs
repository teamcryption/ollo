import { L } from '../src/geo.mjs';
import { icon, line } from '../src/dsl.mjs';

export default {
  category: 'health',
  icons: [
    icon('crutch', 'Crutch', ['injury', 'mobility aid', 'recovery', 'broken leg', 'support'], [line('M9 3.5h6'), line('M10 3.5 11 14.5M14 3.5 13 14.5'), line(L(10.5, 9, 13.5, 9)), line(L(11, 14.5, 13, 14.5)), line(L(12, 14.5, 12, 20.5)), line(L(10.5, 20.5, 13.5, 20.5))], { noAccent: true }),
  ],
};
