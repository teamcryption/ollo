import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'security',
  icons: [
    icon('face-id-leaf', 'Eco Face ID', ['eco', 'green', 'sustainable', 'face id', 'face-id'], [line('M3.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2M12 3.5h2A1.5 1.5 0 0 1 15.5 5v2M15.5 14v2a1.5 1.5 0 0 1-1.5 1.5h-2M7 17.5H5A1.5 1.5 0 0 1 3.5 16v-2'), line(D(7, 8.5) + D(12, 8.5)), line('M9.5 8.5v2.5h-.7M7 13.5c1.5 1 3.5 1 5 0'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('face-id-moon', 'Face ID Night Mode', ['night', 'dark mode', 'sleep', 'face id', 'face-id'], [line('M3.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2M12 3.5h2A1.5 1.5 0 0 1 15.5 5v2M15.5 14v2a1.5 1.5 0 0 1-1.5 1.5h-2M7 17.5H5A1.5 1.5 0 0 1 3.5 16v-2'), line(D(7, 8.5) + D(12, 8.5)), line('M9.5 8.5v2.5h-.7M7 13.5c1.5 1 3.5 1 5 0'), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
    icon('siren-moon', 'Siren Night Mode', ['night', 'dark mode', 'sleep', 'siren', 'siren'], [line('M9.5 3v1.5M4 5.5l1 1M15 5.5l-1 1'), body('M5.5 14v-3.5a4 4 0 0 1 8 0V14Z'), body(R(3.5, 14.5, 12, 3, 0.8)), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
    icon('key-card-moon', 'Key Card Night Mode', ['night', 'dark mode', 'sleep', 'key card', 'key-card'], [body(R(4.5, 3, 10, 15, 1.5)), line('M8 5.5h3'), line('M7 10.5a2.5 2.5 0 0 1 5 0M7.8 13a1.7 1.7 0 0 1 3.4 0'), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
  ],
};
