import { R, L, poly } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'buildings',
  icons: [
    icon('pagoda', 'Pagoda', ['temple', 'shrine', 'asia', 'japan', 'tower'], [body(R(9, 7.5, 6, 3)), body(R(8, 13, 8, 7.5)), body(poly([[7, 7.5], [9, 5], [15, 5], [17, 7.5]], 0.5, true), { cover: true }), body(poly([[5, 13], [7.5, 10.5], [16.5, 10.5], [19, 13]], 0.5, true), { cover: true }), line(L(12, 3, 12, 4.8)), line('M10.5 20.5v-3h3v3')], { noAccent: true }),
    icon('apartment', 'Apartment', ['flat', 'condo', 'residential', 'housing', 'block'], [body(R(5, 3.5, 14, 17, 1.5)), ...[6, 9.8, 13.6].flatMap((y) => [line(R(7.5, y, 3, 2.2, 0.5)), line(R(13.5, y, 3, 2.2, 0.5))]), line('M10.5 20.5V17h3v3.5')], { noAccent: true }),
    icon('windmill', 'Windmill', ['mill', 'farm', 'dutch', 'rural', 'wind'], [body(poly([[8, 20.5], [9.5, 11], [14.5, 11], [16, 20.5]], 0.5, true)), line('M7 3l10 10M17 3 7 13'), line('M11 20.5v-3a1 1 0 0 1 2 0v3')], { noAccent: true, anim: 'spin' }),
  ],
};
