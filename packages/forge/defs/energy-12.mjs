import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const hex = (cx, cy, r) => poly([0, 1, 2, 3, 4, 5].map((k) => { const a = (-90 + 60 * k) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }), 1, true);
const drop = (x) => 'M' + x + ' 9c1.4 1.8 2 3 2 4a2 2 0 0 1-4 0c0-1 .6-2.2 2-4Z';

export default {
  category: 'energy',
  icons: [
    icon('fuel-gauge', 'Fuel Gauge', ['fuel level', 'tank', 'petrol', 'dashboard', 'empty full'], [line(A(12, 15, 8, 180, 360)), line('M5.6 11.2l1.3.8M12 7v1.5M18.4 11.2l-1.3.8'), line('M12 15l3.5-4'), body(C(12, 15, 1.5)), accent(L(7, 19.5, 17, 19.5))]),
    icon('coal', 'Coal', ['fossil fuel', 'mining', 'lumps', 'carbon', 'fuel'], [body(poly([[3.5, 20.5], [4.5, 15.5], [8.5, 13.5], [11.5, 16], [11, 20.5]], 1.2, true)), body(poly([[13, 20.5], [13.5, 15], [17, 13], [20.5, 15.5], [20.5, 20.5]], 1.2, true)), body(poly([[7.5, 11.5], [9.5, 7], [14, 6.5], [15.5, 10.5], [12, 13]], 1.2, true))], { noAccent: true }),
    icon('gas-flame', 'Gas Burner', ['natural gas', 'stove flame', 'heating', 'burner', 'gas supply'], [body(drop(6.5)), body(drop(12)), body(drop(17.5)), body(R(4, 17, 16, 3, 1.5))], { noAccent: true }),
  ],
};
