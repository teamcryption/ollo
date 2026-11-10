import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'interface',
  icons: [
    icon('link-lock', 'Secure Link', ['protected link', 'password link', 'private url', 'share', 'link'], [line('M7.5 11.5 11.5 7.5M6.5 9 5 10.5a2.5 2.5 0 0 0 3.5 3.5L10 12.5M10 6.5 11.5 5a2.5 2.5 0 0 1 3.5 3.5L13.5 10'), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('link-clock', 'Expiring Link', ['temporary link', 'time limited url', 'share', 'expiry', 'link'], [line('M7.5 11.5 11.5 7.5M6.5 9 5 10.5a2.5 2.5 0 0 0 3.5 3.5L10 12.5M10 6.5 11.5 5a2.5 2.5 0 0 1 3.5 3.5L13.5 10'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('link-search', 'Find Link', ['url lookup', 'search links', 'references', 'share', 'link'], [line('M7.5 11.5 11.5 7.5M6.5 9 5 10.5a2.5 2.5 0 0 0 3.5 3.5L10 12.5M10 6.5 11.5 5a2.5 2.5 0 0 1 3.5 3.5L13.5 10'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
  ],
};
