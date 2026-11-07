import { R, L } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'home',
  icons: [
    icon('plunger', 'Plunger', ['toilet', 'bathroom', 'unclog', 'plumbing', 'drain'], [line(L(12, 3, 12, 11.5)), body('M6.5 17.5c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5Z'), body(R(4.5, 17.5, 15, 3, 1.2))], { noAccent: true }),
    icon('mop', 'Mop', ['clean', 'floor', 'housework', 'wash', 'janitor'], [line(L(12, 3, 12, 12.5)), body(R(7, 12.5, 10, 3, 1)), line('M8.3 15.5 7 20.5M10.8 15.5l-.3 5M13.2 15.5l.3 5M15.7 15.5l1.3 5')], { noAccent: true }),
  ],
};
