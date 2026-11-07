import { R, C, L, A, poly, head } from '../src/geo.mjs';
import { icon, body, line, accent, turnEls } from '../src/dsl.mjs';

const FOUR = { up: -90, down: 90, left: 180 };
const nudge = (dist = 2) => ({ preset: 'nudge', dir: [1, 0], dist });
const LR = [line(L(5, 12, 19, 12)), line(head(4.5, 12, 180, 4)), line(head(19.5, 12, 0, 4))];

export default {
  category: 'arrows',
  icons: [
    icon('arrow-big-right', 'Arrow Big Right', ['arrow', 'bold', 'next', 'right', 'direction'], [body(poly([[4, 9], [12, 9], [12, 4.5], [20, 12], [12, 19.5], [12, 15], [4, 15]], 1, true))], { dir: 'right', turns: FOUR, anim: nudge() }),
    icon('arrow-bar-right', 'Arrow Bar Right', ['arrow', 'end', 'last', 'right', 'tab'], [line(L(4, 12, 14.5, 12)), line(head(15, 12, 0, 5)), line(L(19.5, 5.5, 19.5, 18.5))], { dir: 'right', turns: FOUR, anim: nudge(1.5) }),
    icon('arrow-uturn-left', 'U-Turn Left', ['return', 'back', 'u-turn', 'left', 'arrow'], [line('M9 9h6.5a4.5 4.5 0 0 1 0 9H11'), line(head(8.5, 9, 180, 4))], { dir: 'left', turns: { right: 180, up: 90, down: -90 } }),
    icon('arrows-left-right', 'Arrows Left Right', ['resize', 'width', 'horizontal', 'both ways'], LR, { variants: [{ name: 'arrows-up-down', title: 'Arrows Up Down', tags: ['resize', 'height', 'vertical', 'both ways'], els: turnEls(LR, 90) }] }),
    icon('repeat', 'Repeat', ['loop', 'again', 'cycle', 'replay'], [line('M4 11V9.5A2.5 2.5 0 0 1 6.5 7H19'), line(head(19.5, 7, 0, 3.5)), line('M20 13v1.5a2.5 2.5 0 0 1-2.5 2.5H5'), line(head(4.5, 17, 180, 3.5))], { anim: 'pop-draw' }),
    icon('shuffle', 'Shuffle', ['random', 'mix', 'playlist', 'order'], [line('M4 7h3c4 0 6 10 10 10h2.5'), line('M4 17h3c4 0 6-10 10-10h2.5'), line(head(20, 7, 0, 3.5)), line(head(20, 17, 0, 3.5))]),
    icon('caret-up-down', 'Caret Up Down', ['sort', 'select', 'dropdown', 'order'], [body(poly([[8, 10], [12, 5.5], [16, 10]], 1, true)), body(poly([[8, 14], [12, 18.5], [16, 14]], 1, true))]),
    icon('chevrons-up-down', 'Chevrons Up Down', ['expand', 'select', 'dropdown', 'unfold'], [line(poly([[8, 9], [12, 5], [16, 9]], 0.8)), line(poly([[8, 15], [12, 19], [16, 15]], 0.8))]),
  ],
};
