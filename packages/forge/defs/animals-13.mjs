import { icon, body, line } from '../src/dsl.mjs';
import { C, E } from '../src/geo.mjs';

export default {
  category: 'animals',
  icons: [
    icon('shark-fin', 'Shark Fin', ['shark', 'fin', 'sea', 'danger', 'ocean'], [body('M5.5 15.5C9 13 11 9 11.5 4.5c3 2.5 6 6.5 7 11Z'), line('M3 18.5c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1')], { noAccent: true }),
    icon('ant', 'Ant', ['insect', 'bug', 'colony', 'worker', 'tiny'], [body(C(6, 10, 2.2)), body(E(10.6, 11.3, 1.9, 1.5)), body(E(16.5, 12.6, 3.8, 3)), line('M9.5 12.5 7.5 16.5M10.6 12.8v4.5M11.7 12.5l2 4'), line('M5.2 8 3.7 4.5M6.8 8l1.5-3.5')], { noAccent: true }),
  ],
};
