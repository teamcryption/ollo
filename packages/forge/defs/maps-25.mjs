import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'maps',
  icons: [
    icon('signpost-chat', 'Signpost Chat', ['chat', 'support', 'message', 'signpost', 'signpost'], [line('M9.5 3.5v15'), body(poly([[4, 5], [13.5, 5], [15.5, 6.75], [13.5, 8.5], [4, 8.5]], 0.6, true)), body(poly([[15, 10.5], [5.5, 10.5], [3.5, 12.25], [5.5, 14], [15, 14]], 0.6, true)), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('signpost-download', 'Download Signpost', ['download', 'save', 'export', 'signpost', 'signpost'], [line('M9.5 3.5v15'), body(poly([[4, 5], [13.5, 5], [15.5, 6.75], [13.5, 8.5], [4, 8.5]], 0.6, true)), body(poly([[15, 10.5], [5.5, 10.5], [3.5, 12.25], [5.5, 14], [15, 14]], 0.6, true)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('compass-pencil', 'Edit Compass', ['edit', 'write', 'modify', 'compass', 'compass'], [line(C(9.5, 10.5, 6.5)), body('M12 8l-1.3 3.7L7 13l1.3-3.7Z'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('globe-pencil', 'Edit Globe', ['edit', 'write', 'modify', 'globe', 'globe'], [line(C(9.5, 10.5, 6.5)), line('M3 10.5h13M9.5 4c-2.4 3.8-2.4 9.2 0 13M9.5 4c2.4 3.8 2.4 9.2 0 13'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
