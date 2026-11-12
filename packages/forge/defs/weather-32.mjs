import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'weather',
  icons: [
    icon('sunrise-upload', 'Upload Sunrise', ['upload', 'send', 'export', 'sunrise', 'sunrise'], [line('M9.5 4v2M3.5 8.5l1.4 1M15.5 8.5l-1.4 1'), body('M4.5 13.5a5 5 0 0 1 10 0Z'), line('M2.5 16.5h14'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('umbrella-closed-upload', 'Upload Umbrella', ['upload', 'send', 'export', 'umbrella', 'umbrella-closed'], [line('M9.5 3v2'), body('M9.5 5 12 13H7Z'), line('M9.5 13.2V16a1.5 1.5 0 0 1-3 0'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('icicles-upload', 'Upload Icicles', ['upload', 'send', 'export', 'icicles', 'icicles'], [line('M3 4.5h13'), line('M4.5 4.7 5.5 11 6.5 4.7M8.5 4.7l1 8.5 1-8.5M12.5 4.7l1 6 1-6'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
