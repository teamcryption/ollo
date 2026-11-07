import { R, C, L, poly, D, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'maps',
  icons: [
    icon('directions-sign', 'Directions', ['turn', 'route', 'road sign', 'detour', 'navigate'], [body(rotateD(R(5.5, 5.5, 13, 13, 2.5), 45)), line('M9.5 14.5v-2a1.5 1.5 0 0 1 1.5-1.5h4'), line(poly([[13.3, 9], [15.3, 11], [13.3, 13]], 0.4))], { noAccent: true }),
    icon('parking', 'Parking', ['park', 'car park', 'garage', 'p sign'], [body(R(3.5, 3.5, 17, 17, 4)), line('M9.5 17V7h3.5a3 3 0 0 1 0 6H9.5')], { noAccent: true }),
    icon('terrain', 'Terrain', ['mountain', 'landscape', 'elevation', 'hiking', 'outdoors'], [body(poly([[3, 19.5], [9.5, 8], [13, 14], [15.5, 10.5], [21, 19.5]], 0.8, true)), accent(C(17.5, 5.5, 1.5))]),
    icon('distance', 'Distance', ['route', 'journey', 'between', 'measure', 'path'], [body(C(5.5, 18, 2)), body(C(18.5, 6, 2)), line('M7.5 17.2c3.5-.6 3-4.6 6-5.6s3.4-2.6 3.6-4')], { noAccent: true }),
    icon('radar', 'Radar', ['scan', 'sonar', 'nearby', 'detect', 'search'], [body(C(12, 12, 8.5)), line(C(12, 12, 4.5)), line(L(12, 12, 17.6, 6.4))], { noAccent: true, anim: 'spin' }),
  ],
};
