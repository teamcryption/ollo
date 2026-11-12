import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'security',
  icons: [
    icon('eye-flag', 'Report Visibility', ['report', 'flag', 'mark', 'visibility', 'eye'], [body('M2.5 10c1.8-3.2 4.2-5 7-5s5.2 1.8 7 5c-1.8 3.2-4.2 5-7 5s-5.2-1.8-7-5Z'), line(C(9.5, 10, 2)), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('cctv-flag', 'Report CCTV', ['report', 'flag', 'mark', 'cctv', 'cctv'], [body(rotateD(R(3, 5, 10, 4.5, 1.2), 15, 8, 7.25)), line('M8 10.3v3.5H4'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('fire-extinguisher-flag', 'Report Fire Extinguisher', ['report', 'flag', 'mark', 'fire extinguisher', 'fire-extinguisher'], [line('M7 4.5h4M10.5 5.5H13l1.5 2.5'), body(R(7.6, 4.8, 2.8, 2, 0.5)), body(R(6, 7.3, 6, 10.7, 2.5)), line('M6.2 11.3h5.6'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('fingerprint-flag', 'Report Fingerprint', ['report', 'flag', 'mark', 'fingerprint', 'fingerprint'], [line('M5 8a5 5 0 0 1 9 0v3M7 15v-4a2.5 2.5 0 0 1 5 0v5M9.5 11v6M5 11v2'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('password-flag', 'Report Password', ['report', 'flag', 'mark', 'password', 'password'], [body(R(3, 7, 13, 7, 2)), line(D(6, 10.5) + D(9.5, 10.5) + D(13, 10.5)), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
  ],
};
