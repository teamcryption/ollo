import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'energy',
  icons: [
    icon('ev-fire', 'Trending EV Charger', ['trending', 'hot', 'popular', 'ev charger', 'ev'], [body(R(4, 4, 8, 13, 1.5)), line('M12 9h1.5l1.5 2v4'), line('M8.5 7l-1.5 3h2.5L8 13'), body('M17 12c2 1.8 3.6 3.6 3.6 5.6a3.6 3.6 0 0 1-7.2 0c0-1.4.7-2.5 1.6-3.4.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3 .6-4.1Z', { cover: true })], { noAccent: true }),
    icon('solar-panel-fire', 'Trending Solar Panel', ['trending', 'hot', 'popular', 'solar panel', 'solar-panel'], [body(poly([[5, 4], [14, 4], [15.5, 13], [3.5, 13]], 0.8, true)), line('M4.2 8.5h11M9.5 4.2v8.6'), line('M9.5 13.2v4.3M6.5 17.8h6'), body('M17 12c2 1.8 3.6 3.6 3.6 5.6a3.6 3.6 0 0 1-7.2 0c0-1.4.7-2.5 1.6-3.4.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3 .6-4.1Z', { cover: true })], { noAccent: true }),
    icon('wind-turbine-fire', 'Trending Wind Turbine', ['trending', 'hot', 'popular', 'wind turbine', 'wind-turbine'], [line('M9.5 9.3v9M7 18.3h5'), line('M9.5 6.8V3M10.6 8.6l3.3 1.9M8.4 8.6l-3.3 1.9'), body(C(9.5, 8, 1.3)), body('M17 12c2 1.8 3.6 3.6 3.6 5.6a3.6 3.6 0 0 1-7.2 0c0-1.4.7-2.5 1.6-3.4.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3 .6-4.1Z', { cover: true })], { noAccent: true }),
    icon('socket-fire', 'Trending Power Socket', ['trending', 'hot', 'popular', 'power socket', 'socket'], [body(R(3.5, 4.5, 12, 12, 3)), line('M7.5 8.5v2M11.5 8.5v2'), line(D(9.5, 13)), body('M17 12c2 1.8 3.6 3.6 3.6 5.6a3.6 3.6 0 0 1-7.2 0c0-1.4.7-2.5 1.6-3.4.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3 .6-4.1Z', { cover: true })], { noAccent: true }),
  ],
};
