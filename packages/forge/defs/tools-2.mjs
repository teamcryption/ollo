import { R, C, L, A, poly, D, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'tools',
  icons: [
    icon('saw', 'Saw', ['hand saw', 'cut', 'wood', 'carpentry'], [body(poly([[3.5, 16.5], [14, 8], [14, 15.5], [5, 18]], 0.8, true)), body(R(14, 6.5, 6.5, 9.5, 2.5)), line(R(16, 9, 2.5, 4, 1))], { noAccent: true }),
    icon('drill', 'Drill', ['power drill', 'diy', 'screw', 'construction'], [body('M4 6h11a2.5 2.5 0 0 1 2.5 2.5v1A2.5 2.5 0 0 1 15 12H4Z'), line(L(17.7, 9, 21, 9)), body('M7 12h4l1 8.5H7.5Z'), accent(L(7, 9, 10.5, 9))], { anim: 'wiggle' }),
    icon('pliers', 'Pliers', ['grip', 'tool', 'electrician', 'pincers'], [line('M10 3.5 12 10l-4 10.5'), line('M14 3.5 12 10l4 10.5'), body(C(12, 10, 1.3))], { noAccent: true }),
    icon('toolbox', 'Toolbox', ['tool kit', 'repair', 'maintenance', 'fix'], [line('M8.5 8V6A1.5 1.5 0 0 1 10 4.5h4A1.5 1.5 0 0 1 15.5 6v2'), body(R(3, 8, 18, 12, 2)), line(L(3.2, 12.5, 20.8, 12.5)), line(L(7, 12.5, 7, 15)), line(L(17, 12.5, 17, 15)), accent(L(10.5, 16, 13.5, 16))]),
    icon('shovel', 'Shovel', ['dig', 'spade', 'garden', 'construction'], [line(L(16.5, 3.5, 20.5, 7.5)), line(L(18.5, 5.5, 11, 13)), body(rotateD('M6.5 11.5h6V16a3 3 0 0 1-6 0Z', 45, 9.5, 14.5))], { noAccent: true }),
    icon('spirit-level', 'Spirit Level', ['level', 'bubble level', 'align', 'straight'], [body(R(3, 9, 18, 6, 1.5)), line(R(9, 10.75, 6, 2.5, 1.25)), line(L(5.5, 9.2, 5.5, 11)), line(L(18.5, 9.2, 18.5, 11))], { noAccent: true }),
    icon('flashlight', 'Flashlight', ['torch', 'light', 'beam', 'dark'], [body('M7 3.5h10v3l-2.5 3.5v10.5h-5V10L7 6.5Z'), accent(D(12, 14))]),
  ],
};
