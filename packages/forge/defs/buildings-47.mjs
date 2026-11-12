import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'buildings',
  icons: [
    icon('blueprint-pause', 'Pause Blueprint', ['pause', 'hold', 'stop', 'blueprint', 'blueprint'], [body(R(3, 4, 13, 12, 1.2)), line('M5.5 6.5v7h4v-4h4'), line('M13.5 13.5h-2'), line('M3.2 7h1.5'), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('street-lamp-leaf', 'Eco Street Lamp', ['eco', 'green', 'sustainable', 'street lamp', 'street-lamp'], [line('M6.5 18V6A2.5 2.5 0 0 1 9 3.5h3'), body(poly([[10.5, 4], [14.5, 4], [15.8, 7], [9.2, 7]], 0.5, true)), line('M4.5 18h4'), line('M12.5 9.3v1'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('stairs-leaf', 'Eco Stairs', ['eco', 'green', 'sustainable', 'stairs', 'stairs'], [body(poly([[3.5, 18], [3.5, 14], [7, 14], [7, 10.5], [10.5, 10.5], [10.5, 7], [14, 7], [14, 3.5], [16, 3.5], [16, 18]], 0.5, true)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('barn-leaf', 'Eco Barn', ['eco', 'green', 'sustainable', 'barn', 'barn'], [body(poly([[3, 9], [5.5, 4.5], [13.5, 4.5], [16, 9], [16, 18], [3, 18]], 0.8, true)), line('M6.5 17.8V12h6v5.8M6.7 12.2l5.6 5.6M12.3 12.2l-5.6 5.6'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('windmill-leaf', 'Eco Windmill', ['eco', 'green', 'sustainable', 'windmill', 'windmill'], [line('M5 3.5l9 9M14 3.5l-9 9'), body(poly([[7.6, 10.2], [11.4, 10.2], [13, 18], [6, 18]], 0.6, true)), body(C(9.5, 8, 1.3)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('fire-hydrant-leaf', 'Eco Fire Hydrant', ['eco', 'green', 'sustainable', 'fire hydrant', 'fire-hydrant'], [line(D(9.5, 4.3)), body('M6.3 7a3.2 3.2 0 0 1 6.4 0Z'), body(R(5.5, 7.8, 8, 10.2, 1.2)), line('M5.3 11H3.5M13.7 11h1.8'), line('M4 18.6h11'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('silo-leaf', 'Eco Silo', ['eco', 'green', 'sustainable', 'silo', 'silo'], [body('M5.5 18V8a4 4 0 0 1 8 0v10Z'), line('M5.7 11h7.6M5.7 14.5h7.6'), line('M13.5 18h2.5'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
  ],
};
