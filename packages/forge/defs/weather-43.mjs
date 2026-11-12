import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'weather',
  icons: [
    icon('rain-gauge-bulb', 'Rain Gauge Ideas', ['idea', 'tip', 'insight', 'rain gauge', 'rain-gauge'], [body('M6.5 3.5h6l-1 14.5h-4Z'), line('M7.5 7h2M7.5 10h2M7.5 13h2'), line('M5 18.5h9'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('barometer-bulb', 'Barometer Ideas', ['idea', 'tip', 'insight', 'barometer', 'barometer'], [body(C(9.5, 10.5, 6.5)), line('M9.5 10.5l3-3'), line('M5.5 11.5h1M12.5 11.5h1M9.5 6v1'), body(C(9.5, 10.5, 1)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('fog-bulb', 'Fog Ideas', ['idea', 'tip', 'insight', 'fog', 'fog'], [line('M3 7h13M5 10.5h11M3 14h9M7 17.5h9'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('earthquake-bulb', 'Earthquake Ideas', ['idea', 'tip', 'insight', 'earthquake', 'earthquake'], [line('M2.5 10.5h3l1.5-4 2 8 2-10 2 9 1.5-3h2.5'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('thunderstorm-filter', 'Filter Thunderstorm', ['filter', 'sort', 'refine', 'thunderstorm', 'thunderstorm'], [body('M5 12.5a3 3 0 0 1 .3-6 4 4 0 0 1 7.7-.5 3 3 0 0 1 .5 6.5Z'), line('M9 13.5l-1.5 2.5h2.5L8.5 18.5'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('heat-wave-filter', 'Filter Heat Wave', ['filter', 'sort', 'refine', 'heat wave', 'heat-wave'], [line('M5 5c1.5 1.5 1.5 3 0 4.5s-1.5 3 0 4.5M9.5 5c1.5 1.5 1.5 3 0 4.5s-1.5 3 0 4.5M14 5c1.5 1.5 1.5 3 0 4.5s-1.5 3 0 4.5'), line('M3 17.5h13'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
