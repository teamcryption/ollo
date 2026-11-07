import { R, C, L, poly, D, rotateD, arcArrow } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const BLADE = L(12, 7.7, 12, 3);

export default {
  category: 'energy',
  icons: [
    icon('solar-panel', 'Solar Panel', ['solar', 'renewable', 'sun', 'power', 'green energy'], [body(poly([[5, 4], [19, 4], [21, 15], [3, 15]], 1, true)), line(L(4.2, 9.5, 19.8, 9.5)), line(L(12, 4.2, 12, 14.8)), line(L(12, 15, 12, 19)), line(L(8.5, 20, 15.5, 20))], { noAccent: true }),
    icon('wind-turbine', 'Wind Turbine', ['wind', 'renewable', 'power', 'green energy'], [line(L(12, 10.5, 12, 21)), body(C(12, 9, 1.3)), line(BLADE), line(rotateD(BLADE, 120, 12, 9)), line(rotateD(BLADE, 240, 12, 9))], { noAccent: true }),
    icon('recycle', 'Recycle', ['reuse', 'eco', 'sustainable', 'waste', 'green'], [...arcArrow(12, 12, 6.8, -80, 10, 3), ...arcArrow(12, 12, 6.8, 40, 130, 3), ...arcArrow(12, 12, 6.8, 160, 250, 3)].map((d) => line(d)), { noAccent: true, anim: 'spin' }),
    icon('ev-charger', 'EV Charger', ['charging', 'electric car', 'station', 'power'], [body(R(4, 3.5, 10, 17, 2)), accent(poly([[9.8, 7], [7.5, 11.5], [10.5, 11.5], [8.2, 16]], 0.3)), line('M14 9h2a2 2 0 0 1 2 2v4.5a1.5 1.5 0 0 0 3 0V8')]),
    icon('power-socket', 'Power Socket', ['outlet', 'electricity', 'plug', 'mains'], [body(R(3.5, 3.5, 17, 17, 4)), line(L(9, 9, 9, 12)), line(L(15, 9, 15, 12)), accent(D(12, 16))]),
  ],
};
