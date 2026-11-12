import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'nature',
  icons: [
    icon('plant-bulb', 'Plant Ideas', ['idea', 'tip', 'insight', 'plant', 'plant'], [line('M9.5 11V8M9.5 8c-2 0-3.5-1.3-3.5-3.5 2 0 3.5 1.3 3.5 3.5Zm0 0c2 0 3.5-1.3 3.5-3.5-2 0-3.5 1.3-3.5 3.5Z'), body('M5 11h9l-1 6a1 1 0 0 1-1 .8H7a1 1 0 0 1-1-.8Z'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('sun-bulb', 'Sun Ideas', ['idea', 'tip', 'insight', 'sun', 'sun'], [body(C(9.5, 10.5, 3.2)), line('M9.5 3.5V5M9.5 16v1.5M2.5 10.5H4M15 10.5h1.5M4.6 5.6l1 1M13.4 14.4l1 1M14.4 5.6l-1 1M5.6 14.4l-1 1'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('seashell-bulb', 'Seashell Ideas', ['idea', 'tip', 'insight', 'seashell', 'seashell'], [body('M3.5 10a6 6 0 0 1 12 0c0 2.5-1.5 4.5-3.5 5.5H7C5 14.5 3.5 12.5 3.5 10Z'), line('M9.5 15.2V4.4M7.2 15 5.6 6.8M11.8 15l1.6-8.2'), body(R(7, 16.2, 5, 2, 0.8)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('clover-bulb', 'Clover Ideas', ['idea', 'tip', 'insight', 'clover', 'clover'], [body(C(9.5, 6, 2.6)), body(C(6, 9.5, 2.6)), body(C(13, 9.5, 2.6)), line('M9.5 10.5c0 3 1 5.5 3 7.5'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('rake-bulb', 'Rake Ideas', ['idea', 'tip', 'insight', 'rake', 'rake'], [line('M9.5 3.5v9'), line('M5 12.5h9M5 12.5v4M7.3 12.5v4M9.5 12.5v4M11.7 12.5v4M14 12.5v4'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('desert-filter', 'Filter Desert', ['filter', 'sort', 'refine', 'desert', 'desert'], [body(C(13.5, 5.5, 2)), line('M2.5 15c3-2.5 6-2.5 8 0s5 2.5 6 1'), line('M6 12.5V7.5M6 9.5H4.5V8M6 10.5h1.5V9.3'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('cave-filter', 'Filter Cave', ['filter', 'sort', 'refine', 'cave', 'cave'], [body('M2.5 17.5C3.5 9 6 5 9.5 5s6 4 7 12.5Z'), body('M7 17.5c0-3 1-5 2.5-5s2.5 2 2.5 5Z'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('forest-filter', 'Filter Forest', ['filter', 'sort', 'refine', 'forest', 'forest'], [body(poly([[6, 4], [9.5, 12.5], [2.5, 12.5]], 0.6, true)), body(poly([[13, 6], [16.5, 13.5], [9.5, 13.5]], 0.6, true)), line('M6 12.7V17M13 13.7V17M3 17.5h13'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('wheat-filter', 'Filter Wheat', ['filter', 'sort', 'refine', 'wheat', 'wheat'], [line('M9.5 18V6'), line('M9.5 8.5c-2-.5-3-2-3-3.5 2 .5 3 2 3 3.5ZM9.5 12.5c-2-.5-3-2-3-3.5 2 .5 3 2 3 3.5ZM9.5 12.5c2-.5 3-2 3-3.5-2 .5-3 2-3 3.5ZM9.5 8.5c2-.5 3-2 3-3.5-2 .5-3 2-3 3.5Z'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('rake-filter', 'Filter Rake', ['filter', 'sort', 'refine', 'rake', 'rake'], [line('M9.5 3.5v9'), line('M5 12.5h9M5 12.5v4M7.3 12.5v4M9.5 12.5v4M11.7 12.5v4M14 12.5v4'), body(poly([[13, 13], [21, 13], [18, 16.8], [18, 20.5], [16, 19.5], [16, 16.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
