import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'education',
  icons: [
    icon('alpha', 'Alpha', ['greek', 'first', 'math', 'letter', 'physics'], [line('M18.5 6.5c-1.5 7-4 12.5-7.5 12.5-2.7 0-4.5-2.5-4.5-6s2-7 4.8-7c3.5 0 4.5 7.5 7.2 12.5')], { noAccent: true }),
    icon('beta', 'Beta', ['greek', 'test version', 'math', 'letter', 'finance'], [line('M8 20.5V8a3.5 3.5 0 0 1 7 0c0 2-1.5 3.5-3.5 3.5 2.5 0 4.5 1.7 4.5 4s-2 4-4.5 4c-1.5 0-2.8-.6-3.5-1.5')], { noAccent: true }),
    icon('theta', 'Theta', ['greek', 'angle', 'math', 'letter', 'trigonometry'], [line(E(12, 12, 5, 8)), line('M7 12h10')], { noAccent: true }),
    icon('mu', 'Mu', ['micro', 'greek', 'math', 'letter', 'statistics'], [line('M7.5 6.5v14M7.5 13c0 2.5 1.6 4 3.8 4s3.7-1.5 3.7-4V6.5M15 15c0 1.5.7 2.5 2 2.5')], { noAccent: true }),
    icon('phi', 'Phi', ['golden ratio', 'greek', 'math', 'letter', 'philosophy'], [line('M12 3.5v17'), line(E(12, 12, 6, 4.5))], { noAccent: true }),
    icon('psi', 'Psi', ['psychology', 'greek', 'pressure', 'letter', 'physics'], [line('M12 4v16M6 6v3.5a6 6 0 0 0 12 0V6')], { noAccent: true }),
    icon('epsilon', 'Epsilon', ['greek', 'small value', 'math', 'letter', 'calculus'], [line('M16.5 7.5c-.8-1.3-2.4-2-4.5-2-2.5 0-4.5 1.5-4.5 3.3S9.5 12 12 12m0 0c-2.8 0-5 1.5-5 3.5s2.2 3.5 5 3.5c2 0 3.7-.7 4.5-2M9.5 12H12')], { noAccent: true }),
    icon('for-all', 'For All', ['universal quantifier', 'logic', 'math', 'every', 'set theory'], [line('M5.5 4.5 12 19.5l6.5-15M8.2 11h7.6')], { noAccent: true }),
    icon('exists', 'There Exists', ['existential quantifier', 'logic', 'math', 'some', 'set theory'], [line('M6.5 5h11v14h-11M8.5 12h9')], { noAccent: true }),
    icon('therefore', 'Therefore', ['logic', 'conclusion', 'math', 'proof', 'hence'], [body(C(12, 6.5, 1.6)), body(C(6.5, 16.5, 1.6)), body(C(17.5, 16.5, 1.6))], { noAccent: true }),
    icon('element-of', 'Element Of', ['member', 'set theory', 'math', 'belongs to', 'logic'], [line('M17.5 5.5H12a6.5 6.5 0 0 0 0 13h5.5M5.5 12h12')], { noAccent: true }),
    icon('subset', 'Subset', ['set theory', 'contained in', 'math', 'logic', 'part of'], [line('M17.5 5.5H12a6.5 6.5 0 0 0 0 13h5.5')], { noAccent: true }),
  ],
};
