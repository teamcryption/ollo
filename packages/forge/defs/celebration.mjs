import { R, C, L, poly, D, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const RAY = L(12, 9, 12, 4.5);

export default {
  category: 'celebration',
  icons: [
    icon('balloon', 'Balloon', ['party', 'birthday', 'celebrate', 'festive'], [body('M12 3.5a5.5 6.5 0 0 1 5.5 6.5c0 3.8-2.8 6.5-5.5 6.5S6.5 13.8 6.5 10A5.5 6.5 0 0 1 12 3.5Z'), line('M12 16.5c-1 1.2-1 2.6 0 4'), accent('M9 8.5a3 3 0 0 1 2-2')], { anim: { preset: 'bounce', dist: -2 } }),
    icon('party-popper', 'Party Popper', ['party', 'confetti', 'celebrate', 'congrats'], [body(poly([[4, 20], [8, 9.5], [14.5, 16]], 0.8, true)), line('M13 9c1-1 1.5-3 1-5'), line('M15 11c1-1 3-1.5 5-1'), accent(D(18, 5.5))], { anim: 'wiggle' }),
    icon('fireworks', 'Fireworks', ['celebrate', 'new year', 'festival', 'sparkle'], [...[0, 45, 90, 135, 180, 225, 270, 315].map((a) => line(rotateD(RAY, a))), accent(D(12, 12))], { anim: 'pulse' }),
    icon('christmas-tree', 'Christmas Tree', ['holiday', 'xmas', 'winter', 'festive'], [body(poly([[12, 3.5], [18, 11], [15.5, 11], [19.5, 17], [4.5, 17], [8.5, 11], [6, 11]], 0.6, true)), line(L(12, 17, 12, 20.5))], { noAccent: true }),
  ],
};
