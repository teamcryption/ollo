import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'tools',
  icons: [
    icon('measuring-wheel', 'Measuring Wheel', ['surveyor wheel', 'distance', 'measure', 'construction', 'trundle wheel'], [body(C(8, 16, 4.5)), line(C(8, 16, 1.2)), line('M10.8 12.5 17 4.5M15.5 3.5h3')], { noAccent: true }),
    icon('caution-tape', 'Caution Tape', ['barrier tape', 'warning', 'do not cross', 'hazard', 'construction'], [body(rotateD(R(3, 9.5, 18, 5, 1), -20)), line(rotateD('M7 9.7l-2 4.6M11 9.7l-2 4.6M15 9.7l-2 4.6M19 9.7l-2 4.6', -20))], { noAccent: true }),
    icon('scissor-lift', 'Scissor Lift', ['aerial platform', 'lift', 'access platform', 'warehouse', 'construction'], [body(R(5, 3.5, 14, 3, 1)), line('M7 7.5l10 4M17 7.5l-10 4M7 11.5l10 4M17 11.5l-10 4'), body(R(4, 16.5, 16, 3, 1))], { noAccent: true }),
    icon('sawhorse', 'Sawhorse', ['trestle', 'workshop', 'carpentry', 'support', 'diy'], [body(R(3.5, 7, 17, 3, 1)), line('M6 10l-2 10.5M9 10l1.5 10.5M18 10l2 10.5M15 10l-1.5 10.5')], { noAccent: true }),
  ],
};
