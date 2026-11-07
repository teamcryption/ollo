import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const P = (r, a) => [12 + r * Math.cos((a * Math.PI) / 180), 12 + r * Math.sin((a * Math.PI) / 180)];
const f = ([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`;
const wedge = (a0, a1, ri = 3.6, ro = 8.5) => `M${f(P(ri, a0))}L${f(P(ro, a0))}A${ro} ${ro} 0 0 1 ${f(P(ro, a1))}L${f(P(ri, a1))}A${ri} ${ri} 0 0 0 ${f(P(ri, a0))}Z`;
const TOWER = (dx) => `M${4.5 + dx} 20.5c1.5-4 1.5-8 0-12h7c-1.5 4-1.5 8 0 12Z`;

export default {
  category: 'energy',
  icons: [
    icon('radiation', 'Radiation', ['nuclear', 'radioactive', 'hazard', 'atomic'], [body(wedge(-120, -60)), body(wedge(0, 60)), body(wedge(120, 180)), accent(C(12, 12, 1.5))], { anim: 'spin' }),
    icon('pylon', 'Power Line', ['pylon', 'electricity', 'grid', 'transmission', 'utility'], [line('M8 20.5 11 4h2l3 16.5'), line(L(5, 8, 19, 8)), line(L(6.5, 12, 17.5, 12)), line(L(9.8, 12, 14.8, 20.3)), line(L(14.2, 12, 9.2, 20.3))], { noAccent: true }),
    icon('green-energy', 'Green Energy', ['renewable', 'eco power', 'sustainable', 'clean energy'], [body('M5 19C5 10 10 5 19.5 4.5 19 14 14 19 5 19Z'), accent(poly([[13.5, 8], [10.8, 12], [13.8, 12], [11.2, 16]], 0.3))]),
    icon('oil-barrel', 'Oil Barrel', ['oil', 'petroleum', 'crude', 'fuel', 'drum'], [body(R(6, 3.5, 12, 17, 2)), line(L(6.2, 7.5, 17.8, 7.5)), line(L(6.2, 16.5, 17.8, 16.5)), accent('M12 9.8s1.6 1.7 1.6 2.8a1.6 1.6 0 0 1-3.2 0c0-1.1 1.6-2.8 1.6-2.8Z')]),
    icon('power-plant', 'Power Plant', ['cooling tower', 'nuclear plant', 'station', 'generation'], [body(TOWER(0)), body(TOWER(8)), accent('M6 6a2 2 0 0 1 3.5-1.5A2 2 0 0 1 12.5 6')]),
    icon('energy-meter', 'Energy Meter', ['electric meter', 'usage', 'utility', 'consumption'], [body(R(4.5, 3, 15, 18, 2.5)), line(R(7.5, 6, 9, 5, 1)), accent(C(12, 15.5, 2))]),
  ],
};
