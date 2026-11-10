import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'celebration',
  icons: [
    icon('gift-chat', 'Gift Chat', ['chat', 'support', 'message', 'gift', 'gift'], [body(R(3, 8, 13, 10, 1.5)), line('M9.5 8.2v9.6M3.2 11.5h12.6'), line('M9.5 8C8.5 5.5 6 4.5 5.5 6.3S8 8 9.5 8c1.5 0 4.5-.5 4-1.7S10.5 5.5 9.5 8'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('gift-download', 'Download Gift', ['download', 'save', 'export', 'gift', 'gift'], [body(R(3, 8, 13, 10, 1.5)), line('M9.5 8.2v9.6M3.2 11.5h12.6'), line('M9.5 8C8.5 5.5 6 4.5 5.5 6.3S8 8 9.5 8c1.5 0 4.5-.5 4-1.7S10.5 5.5 9.5 8'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('gift-pencil', 'Edit Gift', ['edit', 'write', 'modify', 'gift', 'gift'], [body(R(3, 8, 13, 10, 1.5)), line('M9.5 8.2v9.6M3.2 11.5h12.6'), line('M9.5 8C8.5 5.5 6 4.5 5.5 6.3S8 8 9.5 8c1.5 0 4.5-.5 4-1.7S10.5 5.5 9.5 8'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
