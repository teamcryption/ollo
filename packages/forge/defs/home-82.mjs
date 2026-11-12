import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'home',
  icons: [
    icon('candle-bulb', 'Candle Ideas', ['idea', 'tip', 'insight', 'candle', 'candle'], [line('M9.5 3.5c-1 1.2-1 2.2 0 3 1-.8 1-1.8 0-3Z'), body(R(6.5, 8, 6, 10, 1.2)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('bathtub-bulb', 'Bathtub Ideas', ['idea', 'tip', 'insight', 'bathtub', 'bathtub'], [line('M5 10.5V6a2 2 0 0 1 4 0'), body('M3 10.5h13v2.5a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z'), line('M5.5 17l-.8 1.5'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('fireplace-bulb', 'Fireplace Ideas', ['idea', 'tip', 'insight', 'fireplace', 'fireplace'], [line('M2.5 4h14'), body('M3 18V6h13v12h-3.5v-5a3 3 0 0 0-6 0v5Z'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('radiator-bulb', 'Radiator Ideas', ['idea', 'tip', 'insight', 'radiator', 'radiator'], [body(R(3.5, 5, 12, 11, 1.5)), line('M6.5 7.5v6M9.5 7.5v6M12.5 7.5v6'), line('M5 16v1.5M14 16v1.5'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('curtains-bulb', 'Curtains Ideas', ['idea', 'tip', 'insight', 'curtains', 'curtains'], [line('M3 4h13'), body('M4 4.5h4c0 4 0 8.5-1 13H4Z'), body('M15 4.5h-4c0 4 0 8.5 1 13h3Z'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('spray-bottle-bulb', 'Spray Bottle Ideas', ['idea', 'tip', 'insight', 'spray bottle', 'spray-bottle'], [body('M6.5 3.5h5v2.5h-5Z'), line('M11.5 4.5h2.5l1.2 1.5'), body('M7 6.5h4l1.5 3V17a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V9.5Z'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('coffee-machine-bulb', 'Coffee Machine Ideas', ['idea', 'tip', 'insight', 'coffee machine', 'coffee-machine'], [body(R(4, 3, 11, 4, 1)), body('M4 7.5h11V18H4Z'), body(R(7, 11, 5, 4.5, 1)), line('M9.5 7.7V10'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('trash-bag-filter', 'Filter Trash Bag', ['filter', 'sort', 'refine', 'trash bag', 'trash-bag'], [body('M5 8h9l-1 9.5a1 1 0 0 1-1 .9H7a1 1 0 0 1-1-.9Z'), line('M7 8 6.5 5.5 9.5 7l3-1.5L12 8'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('plunger-filter', 'Filter Plunger', ['filter', 'sort', 'refine', 'plunger', 'plunger'], [line('M9.5 3.5v8.5'), body('M5 16a4.5 4 0 0 1 9 0Z'), line('M4 16h11'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('sponge-filter', 'Filter Sponge', ['filter', 'sort', 'refine', 'sponge', 'sponge'], [body(R(3.5, 7, 12, 8, 2)), line(D(6.5, 10) + D(9.5, 12) + D(12.5, 10)), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
