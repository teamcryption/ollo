import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'health',
  icons: [
    icon('pill-bottle-download', 'Download Pill Bottle', ['download', 'save', 'export', 'pill bottle', 'pill-bottle'], [body(R(5, 3.5, 9, 3, 1)), body(R(5.5, 7.5, 8, 10.5, 1.5)), line('M7.5 11h4M7.5 13.5h4'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('mortar-download', 'Download Mortar and Pestle', ['download', 'save', 'export', 'mortar and pestle', 'mortar'], [line('M11.8 9.8 15.5 4'), body('M3.5 10.5h12a6 6 0 0 1-12 0Z'), line('M7 18.2h5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('pill-bottle-pencil', 'Edit Pill Bottle', ['edit', 'write', 'modify', 'pill bottle', 'pill-bottle'], [body(R(5, 3.5, 9, 3, 1)), body(R(5.5, 7.5, 8, 10.5, 1.5)), line('M7.5 11h4M7.5 13.5h4'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('mortar-pencil', 'Edit Mortar and Pestle', ['edit', 'write', 'modify', 'mortar and pestle', 'mortar'], [line('M11.8 9.8 15.5 4'), body('M3.5 10.5h12a6 6 0 0 1-12 0Z'), line('M7 18.2h5'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
