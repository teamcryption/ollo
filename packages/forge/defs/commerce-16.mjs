import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'commerce',
  icons: [
    icon('basket-bolt', 'Quick Shop', ['express shopping', 'fast checkout', 'instant order', 'basket', 'basket'], [line('M6.5 8.5 9.5 4l3 4.5'), body(poly([[3, 8.5], [16, 8.5], [14.5, 16.5], [4.5, 16.5]], 1, true)), line('M7.5 11v3M11.5 11v3'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('crown-lock', 'Premium Content', ['members only', 'exclusive', 'locked', 'premium', 'crown'], [body(poly([[3, 6], [6.5, 9.5], [9.5, 4.5], [12.5, 9.5], [16, 6], [15, 15], [4, 15]], 0.8, true)), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('crown-clock', 'Membership Expiry', ['subscription renewal', 'premium time', 'plan', 'premium', 'crown'], [body(poly([[3, 6], [6.5, 9.5], [9.5, 4.5], [12.5, 9.5], [16, 6], [15, 15], [4, 15]], 0.8, true)), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('crown-gear', 'Membership Settings', ['premium settings', 'subscription', 'account', 'premium', 'crown'], [body(poly([[3, 6], [6.5, 9.5], [9.5, 4.5], [12.5, 9.5], [16, 6], [15, 15], [4, 15]], 0.8, true)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
  ],
};
