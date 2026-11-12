import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'security',
  icons: [
    icon('eye-upload', 'Upload Visibility', ['upload', 'send', 'export', 'visibility', 'eye'], [body('M2.5 10c1.8-3.2 4.2-5 7-5s5.2 1.8 7 5c-1.8 3.2-4.2 5-7 5s-5.2-1.8-7-5Z'), line(C(9.5, 10, 2)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('face-id-upload', 'Upload Face ID', ['upload', 'send', 'export', 'face id', 'face-id'], [line('M3.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2M12 3.5h2A1.5 1.5 0 0 1 15.5 5v2M15.5 14v2a1.5 1.5 0 0 1-1.5 1.5h-2M7 17.5H5A1.5 1.5 0 0 1 3.5 16v-2'), line(D(7, 8.5) + D(12, 8.5)), line('M9.5 8.5v2.5h-.7M7 13.5c1.5 1 3.5 1 5 0'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('siren-upload', 'Upload Siren', ['upload', 'send', 'export', 'siren', 'siren'], [line('M9.5 3v1.5M4 5.5l1 1M15 5.5l-1 1'), body('M5.5 14v-3.5a4 4 0 0 1 8 0V14Z'), body(R(3.5, 14.5, 12, 3, 0.8)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('key-card-upload', 'Upload Key Card', ['upload', 'send', 'export', 'key card', 'key-card'], [body(R(4.5, 3, 10, 15, 1.5)), line('M8 5.5h3'), line('M7 10.5a2.5 2.5 0 0 1 5 0M7.8 13a1.7 1.7 0 0 1 3.4 0'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
