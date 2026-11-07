import { R, C, L, poly, D, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const HEX = poly([0, 60, 120, 180, 240, 300].map((a) => [12 + 8.5 * Math.cos(((a - 90) * Math.PI) / 180), 12 + 8.5 * Math.sin(((a - 90) * Math.PI) / 180)]), 1.2, true);

export default {
  category: 'tools',
  icons: [
    icon('hammer', 'Hammer', ['tool', 'build', 'construction', 'fix', 'diy'], [body(R(4, 4, 12, 5, 1.5)), line(L(10, 9.2, 10, 20.5))], { noAccent: true, anim: 'wiggle' }),
    icon('wrench', 'Wrench', ['tool', 'repair', 'settings', 'fix', 'maintenance'], [body('M14.5 4a4.5 4.5 0 0 0-4 6.3L4.3 16.5a2 2 0 0 0 2.8 2.8l6.2-6.2A4.5 4.5 0 0 0 19.6 9l-2.8 2.7-2.6-.7-.7-2.6L16.3 5.6A4.5 4.5 0 0 0 14.5 4Z')], { noAccent: true, anim: 'wiggle' }),
    icon('screwdriver', 'Screwdriver', ['tool', 'repair', 'fix', 'assemble'], [body(rotateD(R(3.5, 10, 8.5, 4, 1.5), -45)), line(rotateD(L(12.2, 12, 20.5, 12), -45))], { noAccent: true }),
    icon('paint-roller', 'Paint Roller', ['paint', 'decorate', 'wall', 'renovate'], [body(R(4, 3.5, 14, 5, 1.5)), line('M18 6h1.5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H12v3'), body(R(10.5, 14, 3, 6.5, 1))], { noAccent: true }),
    icon('hard-hat', 'Hard Hat', ['helmet', 'safety', 'construction', 'worker'], [body('M5 15.5a7 7 0 0 1 14 0Z'), body(R(3, 15.5, 18, 2.5, 1.2)), line('M10 9v3.5M14 9v3.5')], { noAccent: true }),
    icon('ladder', 'Ladder', ['climb', 'steps', 'maintenance', 'reach'], [line(L(7, 3.5, 7, 20.5)), line(L(17, 3.5, 17, 20.5)), line(L(7, 7.5, 17, 7.5)), line(L(7, 12, 17, 12)), line(L(7, 16.5, 17, 16.5))], { noAccent: true }),
    icon('tape-measure', 'Tape Measure', ['measure', 'length', 'tool', 'size'], [body(C(10, 12, 6.5)), line(C(10, 12, 2)), line('M16.5 12v6.5H21')], { noAccent: true }),
    icon('nut', 'Nut', ['bolt', 'hardware', 'hex', 'mechanical'], [body(HEX), line(C(12, 12, 3.2))], { noAccent: true, anim: 'spin' }),
  ],
};
