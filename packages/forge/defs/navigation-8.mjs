import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, poly, rotateD } from '../src/geo.mjs';

export default {
  category: 'navigation',
  icons: [
    icon('yield-sign', 'Yield Sign', ['give way', 'road sign', 'traffic', 'caution', 'driving'], [body(poly([[3.5, 4.5], [20.5, 4.5], [12, 19.5]], 1.2, true)), line(poly([[8, 7.5], [16, 7.5], [12, 14.5]], 0.6, true))], { noAccent: true }),
    icon('railway-crossing', 'Railway Crossing', ['level crossing', 'train crossing', 'crossbuck', 'rail', 'road sign'], [body(rotateD(R(3.5, 8, 17, 3, 1), 25, 12, 9.5)), body(rotateD(R(3.5, 8, 17, 3, 1), -25, 12, 9.5), { cover: true }), line('M12 15v5.5M9.5 20.5h5')], { noAccent: true }),
    icon('speed-camera', 'Speed Camera', ['traffic camera', 'radar', 'speeding', 'enforcement', 'road'], [body(R(4, 5, 11, 7, 1.5)), line('M9.5 12v8.5M7 20.5h5'), accent('M17.5 6.5l3-1M17.5 8.5h3M17.5 10.5l3 1')]),
  ],
};
