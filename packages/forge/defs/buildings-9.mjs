import { R, L } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'buildings',
  icons: [
    icon('water-tower', 'Water Tower', ['tank', 'reservoir', 'utility', 'town', 'storage'], [line('M5.5 6.5 12 3.5l6.5 3'), body(R(6, 6.5, 12, 5.5, 1.5)), line('M7.5 12 6 20.5M16.5 12l1.5 8.5M7 16h10')], { noAccent: true }),
    icon('university', 'University', ['college', 'campus', 'academy', 'institution', 'capitol'], [line(L(12, 3, 12, 5)), body('M7.5 9.5a4.5 4.5 0 0 1 9 0Z'), body(R(4, 9.5, 16, 2, 0.5)), line('M6.5 11.5V18M10 11.5V18M14 11.5V18M17.5 11.5V18'), body(R(3.5, 18, 17, 2.5, 0.8))], { noAccent: true }),
  ],
};
