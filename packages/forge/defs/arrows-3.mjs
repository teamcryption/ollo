import { R, C, L, A, poly, head } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const FOUR = { up: -90, down: 90, left: 180 };
const nudge = (dist = 2) => ({ preset: 'nudge', dir: [1, 0], dist });

export default {
  category: 'arrows',
  icons: [
    icon('arrow-turn-right', 'Arrow Turn Right', ['turn', 'curve', 'redirect', 'right', 'arrow'], [line('M4.5 19v-3.5a6 6 0 0 1 6-6h8'), line(head(19, 9.5, 0, 4.5))], { dir: 'right', turns: FOUR, anim: nudge(1.5) }),
    icon('arrow-from-bar-right', 'Arrow From Bar Right', ['exit', 'leave', 'start', 'right', 'arrow'], [line(L(4.5, 5.5, 4.5, 18.5)), line(L(8.5, 12, 19, 12)), line(head(19.5, 12, 0, 5))], { dir: 'right', turns: FOUR, anim: nudge(1.5) }),
    icon('arrows-split-right', 'Arrows Split Right', ['split', 'fork', 'branch', 'diverge'], [line(L(4, 12, 9.5, 12)), line('M9.5 12c3.5 0 5-5 9.5-5'), line('M9.5 12c3.5 0 5 5 9.5 5'), line(head(19.5, 7, 0, 3.5)), line(head(19.5, 17, 0, 3.5))], { dir: 'right', turns: FOUR }),
    icon('arrow-to-dot-right', 'Arrow To Dot Right', ['target', 'goal', 'aim', 'right', 'arrow'], [line(L(3.5, 12, 12, 12)), line(head(12.5, 12, 0, 4.5)), body(C(18, 12, 2.5))], { dir: 'right', turns: FOUR, anim: nudge(1.5) }),
  ],
};
