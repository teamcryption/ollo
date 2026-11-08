import { R, C, E, L, D, star, rotateD, mirrorD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const GLASS = rotateD('M3.5 4h6c0 4-1.3 6.5-3 6.5S3.5 8 3.5 4ZM6.5 10.5V17M4.5 17h4', 15, 6.5, 12);
const LEAVES = [0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
  const r = (a * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
  return `M${(12 + 4.6 * c).toFixed(2)} ${(11 + 4.6 * s).toFixed(2)}L${(12 + 6.4 * c).toFixed(2)} ${(11 + 6.4 * s).toFixed(2)}`;
}).join('');

export default {
  category: 'celebration',
  icons: [
    icon('paper-lantern', 'Paper Lantern', ['lantern', 'festival', 'lunar new year', 'chinese', 'light'], [line(L(12, 3.5, 12, 5.5)), line(L(12, 19.5, 12, 20.5)), body(E(12, 12.5, 7, 5.5)), line('M9.5 7.5c-1.3 3-1.3 7 0 10M14.5 7.5c1.3 3 1.3 7 0 10'), body(R(9, 5.5, 6, 1.6, 0.5)), body(R(9, 18, 6, 1.6, 0.5))], { noAccent: true }),
    icon('cheers', 'Cheers', ['toast', 'wine glasses', 'celebrate', 'clink', 'party'], [line(GLASS), line(mirrorD(GLASS))], { noAccent: true }),
    icon('masquerade-mask', 'Masquerade Mask', ['mask', 'carnival', 'costume', 'party', 'venice'], [line('M17.5 15.5l2.5 5'), body('M3.5 8.5c3 0 5.5 1 8.5 2.5 3-1.5 5.5-2.5 8.5-2.5 0 5-2 8-5 8-1.6 0-2.6-1-3.5-2.5-.9 1.5-1.9 2.5-3.5 2.5-3 0-5-3-5-8Z', { cover: true }), line(E(8, 12.2, 1.8, 1.1) + E(16, 12.2, 1.8, 1.1))], { noAccent: true }),
  ],
};
