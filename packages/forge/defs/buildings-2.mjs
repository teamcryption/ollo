import { R, C, L, A, poly, D, E } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'buildings',
  icons: [
    icon('chapel', 'Chapel', ['church', 'wedding', 'worship', 'religion'], [line(L(12, 7, 12, 3)), line(L(10.5, 4.5, 13.5, 4.5)), body('M5.5 20.5V12l6.5-5 6.5 5v8.5Z'), line('M10.5 20.5v-3a1.5 1.5 0 0 1 3 0v3'), accent(C(12, 12.2, 1.3))]),
    icon('mosque', 'Mosque', ['masjid', 'worship', 'religion', 'dome'], [accent(D(12, 5.5)), body('M7 13a5 5 0 0 1 10 0Z'), body(R(5.5, 13, 13, 7.5, 1)), line(L(3.5, 7, 3.5, 20.5)), line(L(20.5, 7, 20.5, 20.5)), line('M10.5 20.5V18a1.5 1.5 0 0 1 3 0v2.5')]),
    icon('castle', 'Castle', ['fortress', 'palace', 'kingdom', 'medieval', 'fort'], [body(poly([[4, 20.5], [4, 7], [7, 7], [7, 9.5], [10, 9.5], [10, 7], [14, 7], [14, 9.5], [17, 9.5], [17, 7], [20, 7], [20, 20.5]], 0.4, true)), line('M10 20.5V16a2 2 0 0 1 4 0v4.5'), accent(L(7, 13, 7, 14.5)), line(L(17, 13, 17, 14.5))]),
    icon('lighthouse', 'Lighthouse', ['beacon', 'coast', 'guide', 'harbour', 'navigation'], [line('M9 5l3-2 3 2'), body(R(9.5, 5, 5, 4, 1)), body(poly([[9, 20.5], [10, 9], [14, 9], [15, 20.5]], 0.6, true)), line(L(9.6, 14, 14.4, 14)), accent(L(17, 6, 20, 5)), line(L(7, 6, 4, 5))]),
    icon('bridge', 'Bridge', ['suspension bridge', 'crossing', 'connect', 'river'], [line(L(7, 5, 7, 20)), line(L(17, 5, 17, 20)), line('M3 9c2 0 4-4 4-4s2.5 6 5 6 5-6 5-6 2 4 4 4'), line(L(3, 14, 21, 14)), accent('M9.5 18.5c.8-.8 1.7-.8 2.5 0s1.7.8 2.5 0')]),
    icon('skyscraper', 'Skyscraper', ['tower', 'high-rise', 'office', 'downtown'], [line(L(12, 3, 12, 6)), body(R(7.5, 6, 9, 14.5, 1.5)), line(D(10.5, 9.5)), line(D(13.5, 9.5)), line(D(10.5, 13)), line(D(13.5, 13)), line(D(10.5, 16.5)), accent(D(13.5, 16.5))]),
    icon('barn', 'Barn', ['farm', 'agriculture', 'ranch', 'rural', 'stable'], [body('M4 20.5V10l3-4.5h10l3 4.5v10.5Z'), line(R(8.5, 12.5, 7, 8, 0.5)), line('M8.7 12.7 15.3 20.3M15.3 12.7 8.7 20.3'), accent(L(10.5, 9, 13.5, 9))]),
    icon('igloo', 'Igloo', ['arctic', 'snow house', 'winter', 'cold', 'eskimo'], [body('M3 19a9 9 0 0 1 18 0Z'), line('M9 19v-2.5a3 3 0 0 1 6 0V19'), line(L(4.5, 14.5, 8.5, 14.5)), line(L(15.5, 14.5, 19.5, 14.5)), line(L(9, 11, 15, 11)), line(L(3, 20.5, 21, 20.5))], { noAccent: true }),
    icon('city', 'City', ['skyline', 'urban', 'downtown', 'town', 'metropolis'], [body(R(3.5, 10, 6, 10.5, 1)), body(R(13, 7, 7.5, 13.5, 1)), body(R(8.5, 3.5, 6.5, 17, 1), { cover: true }), line(D(11.75, 7.5)), line(D(11.75, 11)), line(D(16.75, 11)), line(D(16.75, 14.5)), accent(D(6, 14))]),
    icon('stadium', 'Stadium', ['arena', 'sports ground', 'venue', 'match', 'field'], [line(L(4, 3.5, 4, 8.5)), line(L(20, 3.5, 20, 8.5)), body(E(12, 13.5, 9, 6)), line(E(12, 13.5, 5, 2.8)), accent(D(12, 13.5))]),
    icon('garage', 'Garage', ['car park', 'parking', 'storage', 'shed'], [body('M3.5 20.5V9.5L12 4l8.5 5.5v11Z'), line(R(7, 12, 10, 8.5, 0.5)), line(L(7.2, 15, 16.8, 15)), line(L(7.2, 17.8, 16.8, 17.8))], { noAccent: true }),
  ],
};
