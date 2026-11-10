import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, L } from '../src/geo.mjs';

export default {
  category: 'communication',
  icons: [
    icon('newspaper', 'Newspaper', ['news', 'press', 'daily', 'headlines', 'journal'], [line('M17.5 8h2a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H5.5'), body(R(3.5, 4, 14, 16, 1.5)), accent(L(6.5, 7.5, 14.5, 7.5)), line('M6.5 11h4M6.5 14h4M6.5 17h8'), line(R(12, 10.5, 3, 4, 0.5))]),
    icon('billboard', 'Billboard', ['advertising', 'ad', 'hoarding', 'roadside', 'outdoor ad'], [body(R(3, 4, 18, 10, 1.5)), line('M6.5 8h7M6.5 11h4'), line('M8 14v6.5M16 14v6.5M5 20.5h14')], { noAccent: true }),
    icon('intercom', 'Intercom', ['door phone', 'buzzer', 'entry phone', 'apartment', 'speaker'], [body(R(6, 3, 12, 18, 2)), line('M9.5 6.5h5M9.5 8.5h5M9.5 10.5h5'), accent(C(12, 16, 1.8))]),
  ],
};
