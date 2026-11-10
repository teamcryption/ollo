import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'weather',
  icons: [
    icon('moon-phase', 'Moon Phases', ['lunar cycle', 'moon', 'astronomy', 'night sky', 'calendar'], [line(C(5.5, 12, 2.5)), line('M12 9.5a2.5 2.5 0 0 1 0 5'), body('M12 9.5a2.5 2.5 0 0 0 0 5Z'), body(C(18.5, 12, 2.5))], { noAccent: true }),
    icon('windvane', 'Wind Vane', ['weathervane', 'wind direction', 'weather', 'roof', 'compass'], [line('M12 9v11.5M9.5 20.5h5M8.5 13h7'), line('M4.5 6.5h12'), body(poly([[16.5, 4], [20.5, 6.5], [16.5, 9]], 0.6, true)), line('M4.5 6.5 3.5 4.5M4.5 6.5l-1 2')], { noAccent: true }),
    icon('aurora', 'Aurora', ['northern lights', 'aurora borealis', 'night sky', 'arctic', 'polar'], [line('M3.5 8c3-2.5 5.5-2.5 8.5 0s5.5 2.5 8.5 0M3.5 12c3-2.5 5.5-2.5 8.5 0s5.5 2.5 8.5 0'), line('M3.5 20.5 8 16l3 3 3-3 6.5 4.5')], { noAccent: true }),
  ],
};
