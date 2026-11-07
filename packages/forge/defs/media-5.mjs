import { C, L } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

const P = (r, a) => [12 + r * Math.cos((a * Math.PI) / 180), 12 + r * Math.sin((a * Math.PI) / 180)];

export default {
  category: 'media',
  icons: [
    icon('aperture', 'Aperture', ['shutter', 'lens', 'camera', 'f-stop', 'photography'], [body(C(12, 12, 8.5)), ...[0, 60, 120, 180, 240, 300].map((a) => { const [x1, y1] = P(8.3, a); const [x2, y2] = P(3.46, a + 98.8); return line(L(x1, y1, x2, y2)); })], { noAccent: true, anim: 'spin' }),
  ],
};
