import { icon, body, line } from '../src/dsl.mjs';
import { R, C, D as dot, E } from '../src/geo.mjs';

const f = (v) => +v.toFixed(2);
const P = (r, a) => `${f(12 + r * Math.cos((a * Math.PI) / 180))} ${f(12 + r * Math.sin((a * Math.PI) / 180))}`;
const ringSeg = (r0, r1, a0, a1) => `M${P(r1, a0)}A${r1} ${r1} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${P(r1, a1)}L${P(r0, a1)}A${r0} ${r0} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${P(r0, a0)}Z`;
const radial = (a) => `M${P(3.8, a)}L${P(7.7, a)}`;

export default {
  category: 'food',
  icons: [
    icon('butter', 'Butter', ['butter dish', 'dairy', 'spread', 'baking', 'margarine'], [body(R(6, 8, 12, 5.5, 1.2)), body('M3.5 15h17a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3Z')], { noAccent: true }),
    icon('olive', 'Olive', ['olives', 'mediterranean', 'olive oil', 'pickle', 'antipasto'], [body(E(11, 14, 5, 6)), line(E(11, 13, 1.6, 1.9)), body('M14 8c.5-2.5 2.8-4.3 5.5-4.5-.4 2.7-2.6 4.6-5.5 4.5Z')], { noAccent: true }),
  ],
};
