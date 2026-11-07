import { R, C, L, A, poly, D, E, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'transport',
  icons: [
    icon('tractor', 'Tractor', ['farm', 'agriculture', 'farming', 'vehicle'], [line('M11.5 11.5V4.5h5.5l1.5 7'), line('M4.5 16v-4.5h15'), body(C(15.5, 16, 4.5), { cover: true }), line(C(15.5, 16, 1.5)), body(C(6, 18, 2.5), { cover: true })], { noAccent: true }),
    icon('kayak', 'Kayak', ['canoe', 'paddle', 'boat', 'water sport'], [body(rotateD(E(12, 13, 9.3, 2.5), -20, 12, 13)), line(rotateD(L(12, 3.5, 12, 20.5), 35, 12, 12)), body(rotateD(E(12, 4, 1.3, 2.2), 35, 12, 12)), body(rotateD(E(12, 20, 1.3, 2.2), 35, 12, 12))], { noAccent: true }),
    icon('parachute', 'Parachute', ['skydiving', 'drop', 'airdrop', 'jump'], [body('M3.5 11a8.5 8.5 0 0 1 17 0Z'), line(L(3.8, 11.2, 10, 16)), line(L(12, 11.2, 12, 16)), line(L(20.2, 11.2, 14, 16)), accent(C(12, 19.3, 1.4))], { anim: 'wiggle' }),
  ],
};
