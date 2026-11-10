import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'buildings',
  icons: [
    icon('building-lock', 'Restricted Building', ['secured office', 'access control', 'locked premises', 'security', 'building'], [body(R(4, 3.5, 11, 16, 1.5)), line('M7 7h1.5M10.5 7H12M7 10.5h1.5M10.5 10.5H12M7 14h1.5'), body(R(13.8, 15, 7, 6, 1.5), { cover: true }), line('M15.3 15v-1.5a2 2 0 0 1 4 0V15')], { noAccent: true }),
    icon('building-star', 'Featured Property', ['top office', 'premium space', 'real estate', 'highlight', 'building'], [body(R(4, 3.5, 11, 16, 1.5)), line('M7 7h1.5M10.5 7H12M7 10.5h1.5M10.5 10.5H12M7 14h1.5'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
  ],
};
