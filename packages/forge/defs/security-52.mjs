import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'security',
  icons: [
    icon('fire-extinguisher-bulb', 'Fire Extinguisher Ideas', ['idea', 'tip', 'insight', 'fire extinguisher', 'fire-extinguisher'], [line('M7 4.5h4M10.5 5.5H13l1.5 2.5'), body(R(7.6, 4.8, 2.8, 2, 0.5)), body(R(6, 7.3, 6, 10.7, 2.5)), line('M6.2 11.3h5.6'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('fingerprint-bulb', 'Fingerprint Ideas', ['idea', 'tip', 'insight', 'fingerprint', 'fingerprint'], [line('M5 8a5 5 0 0 1 9 0v3M7 15v-4a2.5 2.5 0 0 1 5 0v5M9.5 11v6M5 11v2'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('face-id-bulb', 'Face ID Ideas', ['idea', 'tip', 'insight', 'face id', 'face-id'], [line('M3.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2M12 3.5h2A1.5 1.5 0 0 1 15.5 5v2M15.5 14v2a1.5 1.5 0 0 1-1.5 1.5h-2M7 17.5H5A1.5 1.5 0 0 1 3.5 16v-2'), line(D(7, 8.5) + D(12, 8.5)), line('M9.5 8.5v2.5h-.7M7 13.5c1.5 1 3.5 1 5 0'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
  ],
};
