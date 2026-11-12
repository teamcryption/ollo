import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'energy',
  icons: [
    icon('fuse-box-fire', 'Trending Fuse Box', ['trending', 'hot', 'popular', 'fuse box', 'fuse-box'], [body(R(4, 3, 11, 15, 1.2)), line('M7 6.5v3M9.5 6.5v3M12 6.5v3M7 12v3M9.5 12v3M12 12v3'), body('M17 12c2 1.8 3.6 3.6 3.6 5.6a3.6 3.6 0 0 1-7.2 0c0-1.4.7-2.5 1.6-3.4.2 1 .7 1.7 1.4 1.9-.3-1.7.1-3 .6-4.1Z', { cover: true })], { noAccent: true }),
    icon('fuse-box-trophy', 'Fuse Box Award', ['award', 'winner', 'achievement', 'fuse box', 'fuse-box'], [body(R(4, 3, 11, 15, 1.2)), line('M7 6.5v3M9.5 6.5v3M12 6.5v3M7 12v3M9.5 12v3M12 12v3'), body('M14 12.8h6v2.7a3 3 0 0 1-6 0Z', { cover: true }), line('M17 18.5v1.7M15 20.6h4M14 13.8h-1v.6a1.6 1.6 0 0 0 1.4 1.6M20 13.8h1v.6a1.6 1.6 0 0 1-1.4 1.6')], { noAccent: true }),
    icon('fuse-box-moon', 'Fuse Box Night Mode', ['night', 'dark mode', 'sleep', 'fuse box', 'fuse-box'], [body(R(4, 3, 11, 15, 1.2)), line('M7 6.5v3M9.5 6.5v3M12 6.5v3M7 12v3M9.5 12v3M12 12v3'), body('M20.5 18.7A4 4 0 0 1 16 12.6a4.2 4.2 0 1 0 4.5 6.1Z', { cover: true })], { noAccent: true }),
  ],
};
