import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'energy',
  icons: [
    icon('ev-pin', 'Charging Station', ['ev charger location', 'charge point map', 'electric car', 'ev'], [body(R(4, 4, 8, 13, 1.5)), line('M12 9h1.5l1.5 2v4'), line('M8.5 7l-1.5 3h2.5L8 13'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('ev-clock', 'Charge Time', ['charging duration', 'time to full', 'battery', 'electric car', 'ev'], [body(R(4, 4, 8, 13, 1.5)), line('M12 9h1.5l1.5 2v4'), line('M8.5 7l-1.5 3h2.5L8 13'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('ev-search', 'Find Charger', ['charger search', 'nearby chargers', 'electric car', 'ev'], [body(R(4, 4, 8, 13, 1.5)), line('M12 9h1.5l1.5 2v4'), line('M8.5 7l-1.5 3h2.5L8 13'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
  ],
};
