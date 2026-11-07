import { R, C, L, A, poly, D, E, scaleD, translateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const PIN = 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z';
const MAP = poly([[3.5, 6], [9, 4], [15, 6], [20.5, 4], [20.5, 18], [15, 20], [9, 18], [3.5, 20]], 1, true);
const AREA = [[5, 7], [16, 4.5], [19.5, 15], [8, 19.5]];

export default {
  category: 'maps',
  icons: [
    icon('area', 'Area', ['measure area', 'polygon', 'plot', 'land', 'zone'], [line(poly(AREA, 0, true)), ...AREA.map(([x, y]) => body(R(x - 1.6, y - 1.6, 3.2, 3.2, 0.8), { cover: true })), accent(D(12, 12))]),
    icon('island', 'Island', ['beach', 'tropical', 'palm', 'holiday', 'vacation'], [body('M5 20a7 3.5 0 0 1 14 0Z'), line('M12.5 16.6c0-3-.5-6-2-8.5'), line('M10.5 8a4 4 0 0 0-6 1.5'), line('M10.5 8a4.5 4.5 0 0 1 6.5 0'), line('M10.5 8c-.5-2 .5-3.5 2-4.5'), accent(C(18.8, 4.5, 1.3))]),
    icon('scale-bar', 'Map Scale', ['scale', 'distance', 'legend', 'measure', 'km'], [body(R(3.5, 10, 8.5, 4, 0.8)), line(R(12, 10, 8.5, 4, 0.8))], { noAccent: true }),
    icon('globe-pin', 'Global Location', ['worldwide', 'international', 'region', 'country', 'geo'], [body(C(10.5, 10.5, 7.5)), line(E(10.5, 10.5, 3, 7.3)), line(L(3.2, 10.5, 17.8, 10.5)), body(translateD(scaleD(PIN, 0.55), 4.5, 4), { cover: true }), accent(C(16.5, 14.9, 1.3))]),
    icon('map-search', 'Search Map', ['find place', 'explore', 'lookup', 'nearby'], [body(MAP), line(L(9, 4.4, 9, 17.6)), body(C(16, 15.5, 3.8), { cover: true }), line(L(18.8, 18.3, 21, 20.5))], { noAccent: true }),
    icon('map-marked', 'Treasure Map', ['destination', 'x marks the spot', 'treasure', 'adventure'], [body(MAP), line(D(6.5, 16)), line(D(8.5, 14.3)), line(D(10.5, 13)), accent('M14 9.5l3 3m0-3-3 3')]),
  ],
};
