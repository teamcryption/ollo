import { icon, body, line } from '../src/dsl.mjs';
import { R, poly, arcArrow } from '../src/geo.mjs';

export default {
  category: 'navigation',
  icons: [
    icon('roundabout', 'Roundabout', ['traffic circle', 'rotary', 'junction', 'road', 'driving'], [line('M12 3v4M3 12h4M12 17v4M17 12h4'), ...arcArrow(12, 12, 4.5, -60, 240, 2.2).map((d) => line(d))], { noAccent: true }),
    icon('toll-booth', 'Toll Booth', ['toll', 'tollgate', 'highway', 'payment', 'barrier'], [body(R(3, 4, 9, 2.5, 1)), body(R(4, 7.5, 7, 13, 1)), line('M6 10.5h3'), line('M11 14h9.5')], { noAccent: true }),
    icon('detour', 'Detour', ['diversion', 'reroute', 'road sign', 'alternate route', 'driving'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), line('M9.5 15.5V12h5M12.8 10l2 2-2 2')], { noAccent: true }),
  ],
};
