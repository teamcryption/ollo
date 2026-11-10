import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'business',
  icons: [
    icon('scale-download', 'Download Justice Scale', ['download', 'save', 'export', 'justice scale', 'scale'], [line('M9.5 3.5v14M6 17.8h7M5 6h9'), line('M5 6.2l-2 4.2M5 6.2l2 4.2M14 6.2l-2 4.2M14 6.2l2 4.2'), body('M2.8 10.6h4.4a2.2 2.2 0 0 1-4.4 0Z'), body('M11.8 10.6h4.4a2.2 2.2 0 0 1-4.4 0Z'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('gavel-download', 'Download Gavel', ['download', 'save', 'export', 'gavel', 'gavel'], [body(rotateD(R(7.5, 3, 7, 4, 1), 45, 11, 5)), line('M9.3 7.2 3.8 12.7'), body(R(3, 15.5, 8, 2.5, 0.8)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('scale-pencil', 'Edit Justice Scale', ['edit', 'write', 'modify', 'justice scale', 'scale'], [line('M9.5 3.5v14M6 17.8h7M5 6h9'), line('M5 6.2l-2 4.2M5 6.2l2 4.2M14 6.2l-2 4.2M14 6.2l2 4.2'), body('M2.8 10.6h4.4a2.2 2.2 0 0 1-4.4 0Z'), body('M11.8 10.6h4.4a2.2 2.2 0 0 1-4.4 0Z'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('gavel-pencil', 'Edit Gavel', ['edit', 'write', 'modify', 'gavel', 'gavel'], [body(rotateD(R(7.5, 3, 7, 4, 1), 45, 11, 5)), line('M9.3 7.2 3.8 12.7'), body(R(3, 15.5, 8, 2.5, 0.8)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
