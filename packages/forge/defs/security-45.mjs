import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'security',
  icons: [
    icon('cctv-leaf', 'Eco CCTV', ['eco', 'green', 'sustainable', 'cctv', 'cctv'], [body(rotateD(R(3, 5, 10, 4.5, 1.2), 15, 8, 7.25)), line('M8 10.3v3.5H4'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('fire-extinguisher-leaf', 'Eco Fire Extinguisher', ['eco', 'green', 'sustainable', 'fire extinguisher', 'fire-extinguisher'], [line('M7 4.5h4M10.5 5.5H13l1.5 2.5'), body(R(7.6, 4.8, 2.8, 2, 0.5)), body(R(6, 7.3, 6, 10.7, 2.5)), line('M6.2 11.3h5.6'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('fingerprint-leaf', 'Eco Fingerprint', ['eco', 'green', 'sustainable', 'fingerprint', 'fingerprint'], [line('M5 8a5 5 0 0 1 9 0v3M7 15v-4a2.5 2.5 0 0 1 5 0v5M9.5 11v6M5 11v2'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
  ],
};
