import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'security',
  icons: [
    icon('eye-sparkle', 'AI Visibility', ['ai', 'smart', 'magic', 'visibility', 'eye'], [body('M2.5 10c1.8-3.2 4.2-5 7-5s5.2 1.8 7 5c-1.8 3.2-4.2 5-7 5s-5.2-1.8-7-5Z'), line(C(9.5, 10, 2)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('cctv-sparkle', 'AI CCTV', ['ai', 'smart', 'magic', 'cctv', 'cctv'], [body(rotateD(R(3, 5, 10, 4.5, 1.2), 15, 8, 7.25)), line('M8 10.3v3.5H4'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('fire-extinguisher-sparkle', 'AI Fire Extinguisher', ['ai', 'smart', 'magic', 'fire extinguisher', 'fire-extinguisher'], [line('M7 4.5h4M10.5 5.5H13l1.5 2.5'), body(R(7.6, 4.8, 2.8, 2, 0.5)), body(R(6, 7.3, 6, 10.7, 2.5)), line('M6.2 11.3h5.6'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('fingerprint-sparkle', 'AI Fingerprint', ['ai', 'smart', 'magic', 'fingerprint', 'fingerprint'], [line('M5 8a5 5 0 0 1 9 0v3M7 15v-4a2.5 2.5 0 0 1 5 0v5M9.5 11v6M5 11v2'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('password-sparkle', 'AI Password', ['ai', 'smart', 'magic', 'password', 'password'], [body(R(3, 7, 13, 7, 2)), line(D(6, 10.5) + D(9.5, 10.5) + D(13, 10.5)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
  ],
};
