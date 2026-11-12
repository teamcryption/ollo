import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'weather',
  icons: [
    icon('barometer-pause', 'Pause Barometer', ['pause', 'hold', 'stop', 'barometer', 'barometer'], [body(C(9.5, 10.5, 6.5)), line('M9.5 10.5l3-3'), line('M5.5 11.5h1M12.5 11.5h1M9.5 6v1'), body(C(9.5, 10.5, 1)), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('earthquake-pause', 'Pause Earthquake', ['pause', 'hold', 'stop', 'earthquake', 'earthquake'], [line('M2.5 10.5h3l1.5-4 2 8 2-10 2 9 1.5-3h2.5'), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('thunderstorm-pause', 'Pause Thunderstorm', ['pause', 'hold', 'stop', 'thunderstorm', 'thunderstorm'], [body('M5 12.5a3 3 0 0 1 .3-6 4 4 0 0 1 7.7-.5 3 3 0 0 1 .5 6.5Z'), line('M9 13.5l-1.5 2.5h2.5L8.5 18.5'), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('wind-leaf', 'Eco Wind', ['eco', 'green', 'sustainable', 'wind', 'wind'], [line('M3 8h9a2.5 2.5 0 1 0-2.5-2.5M3 12h11.5a2.5 2.5 0 1 1-2.5 2.5M3 16h5'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
  ],
};
