import { icon, body, line } from '../src/dsl.mjs';
import { R, C } from '../src/geo.mjs';

const f = (v) => +v.toFixed(2);
const P = (r, a, cx = 12, cy = 12) => `${f(cx + r * Math.cos((a * Math.PI) / 180))} ${f(cy + r * Math.sin((a * Math.PI) / 180))}`;
const asin = (x) => (Math.asin(x) * 180) / Math.PI;
// Pie wedge from the centre with straight cuts held d away from the radial lines.
const wedge = (r, a0, a1, d = 1.1) => {
  const h = (a1 - a0) / 2;
  const k = d / Math.sin((h * Math.PI) / 180);
  const e = asin(d / r);
  return `M${P(k, a0 + h)}L${P(r, a0 + e)}A${r} ${r} 0 0 1 ${P(r, a1 - e)}Z`;
};
// Ring segment between radii r0 and r1 with the same parallel cuts.
const ring = (r0, r1, a0, a1, d = 1.1) => {
  const e0 = asin(d / r0), e1 = asin(d / r1);
  const big = a1 - a0 > 180 ? 1 : 0;
  return `M${P(r1, a0 + e1)}A${r1} ${r1} 0 ${big} 1 ${P(r1, a1 - e1)}L${P(r0, a1 - e0)}A${r0} ${r0} 0 ${big} 0 ${P(r0, a0 + e0)}Z`;
};

export default {
  category: 'data',
  icons: [
    icon('chart-polar', 'Polar Chart', ['rose chart', 'coxcomb', 'radial bars', 'statistics', 'graph'], [body(wedge(8.5, -90, 0)), body(wedge(5.5, 0, 90)), body(wedge(7, 90, 180)), body(wedge(4.5, 180, 270))], { noAccent: true }),
    icon('chart-sunburst', 'Sunburst Chart', ['hierarchy chart', 'radial', 'nested pie', 'breakdown', 'segments'], [body(C(12, 12, 3.2)), body(ring(5.3, 8.5, -90, 60)), body(ring(5.3, 8.5, 60, 170)), body(ring(5.3, 8.5, 170, 270))], { noAccent: true }),
    icon('chart-dumbbell', 'Dumbbell Chart', ['range chart', 'gap chart', 'before after', 'comparison', 'connected dots'], [line('M7.1 6h7.8'), body(C(5.5, 6, 1.6)), body(C(16.5, 6, 1.6)), line('M10.6 12h6.8'), body(C(9, 12, 1.6)), body(C(19, 12, 1.6)), line('M6.2 18h5.2'), body(C(4.6, 18, 1.6)), body(C(13, 18, 1.6))], { noAccent: true }),
  ],
};
