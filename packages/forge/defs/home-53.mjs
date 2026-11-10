import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'home',
  icons: [
    icon('ceiling-light-pencil', 'Edit Ceiling Light', ['edit', 'write', 'modify', 'ceiling light', 'ceiling-light'], [line('M9.5 3v4.3'), body('M4 13a5.5 5.5 0 0 1 11 0Z'), line('M8 15a1.5 1.5 0 0 0 3 0'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('fireplace-pencil', 'Edit Fireplace', ['edit', 'write', 'modify', 'fireplace', 'fireplace'], [line('M2.5 4h14'), body('M3 18V6h13v12h-3.5v-5a3 3 0 0 0-6 0v5Z'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('mop-pencil', 'Edit Mop', ['edit', 'write', 'modify', 'mop', 'mop'], [line('M13.5 3.5 9 12'), body('M5 12.5h7.5l1 5.5H4Z'), line('M6.5 15v2.8M8.8 15v2.8M11.1 15v2.8'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('soap-dispenser-pencil', 'Edit Soap Dispenser', ['edit', 'write', 'modify', 'soap dispenser', 'soap-dispenser'], [line('M9.5 6V4h3.5'), body(R(8, 6, 3, 2, 0.5)), body(R(5, 8.7, 9, 9.3, 2.2)), line('M7.5 13h4'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('pillow-pencil', 'Edit Pillow', ['edit', 'write', 'modify', 'pillow', 'pillow'], [body('M4 5.5c3.5 1 7.5 1 11 0-1 3.5-1 6.5 0 10-3.5-1-7.5-1-11 0 1-3.5 1-6.5 0-10Z'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('wardrobe-pencil', 'Edit Wardrobe', ['edit', 'write', 'modify', 'wardrobe', 'wardrobe'], [body(R(4, 3.5, 11, 14, 1.5)), line('M9.5 3.7v13.6'), line('M8 9v2M11 9v2'), line('M5.5 17.7v1M13.5 17.7v1'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
