import { R, C, L, A, poly, head, arcArrow } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

// Every arrow is drawn pointing right once; turns derive the other directions.
const FOUR = { up: -90, down: 90, left: 180 };
const DIAG = { 'down-right': 90, 'down-left': 180, 'up-left': -90 };
const nudge = (dist = 2.5) => ({ preset: 'nudge', dir: [1, 0], dist });
const nudgeDiag = { preset: 'nudge', dir: [0.7, -0.7], dist: 2 };

export default {
  category: 'arrows',
  icons: [
    icon('arrow-right', 'Arrow Right', ['arrow', 'next', 'forward', 'right', 'direction'], [line(L(4.5, 12, 18.5, 12)), line(head(19, 12, 0, 6))], { dir: 'right', turns: FOUR, anim: nudge() }),
    icon('arrow-up-right', 'Arrow Up Right', ['arrow', 'diagonal', 'outward', 'up-right', 'direction'], [line(L(6.5, 17.5, 16.8, 7.2)), line(poly([[9, 6.5], [17.5, 6.5], [17.5, 15]], 0.9))], { dir: 'up-right', turns: DIAG, anim: nudgeDiag }),
    icon('arrow-right-short', 'Arrow Right Short', ['arrow', 'next', 'small', 'right', 'direction'], [accent(L(6.5, 12, 13.5, 12)), line(head(17.5, 12, 0, 4.5))], { dir: 'right', turns: FOUR, anim: nudge(2) }),
    icon('chevron-right', 'Chevron Right', ['chevron', 'next', 'caret', 'right', 'expand'], [line(poly([[9.5, 6], [15.5, 12], [9.5, 18]], 1))], { dir: 'right', turns: FOUR, anim: nudge(2) }),
    icon('chevrons-right', 'Chevrons Right', ['chevron', 'double', 'fast forward', 'right', 'skip'], [line(poly([[6, 6.5], [11.5, 12], [6, 17.5]], 1)), accent(poly([[12.5, 6.5], [18, 12], [12.5, 17.5]], 1))], { dir: 'right', turns: FOUR, anim: nudge(2) }),
    icon('caret-right', 'Caret Right', ['triangle', 'play', 'caret', 'right', 'expand'], [body(poly([[9.5, 6.5], [16, 12], [9.5, 17.5]], 1.6, true))], { dir: 'right', turns: FOUR, anim: nudge(1.5) }),
    icon('arrow-circle-right', 'Arrow Circle Right', ['arrow', 'circle', 'next', 'right', 'go'], [body(C(12, 12, 8.5)), line(L(8, 12, 15.5, 12)), line(head(16, 12, 0, 3.5))], { dir: 'right', turns: FOUR, anim: 'pop-draw' }),
    icon('arrow-square-right', 'Arrow Square Right', ['arrow', 'square', 'next', 'right', 'box'], [body(R(4, 4, 16, 16, 4)), line(L(8, 12, 15.5, 12)), line(head(16, 12, 0, 3.5))], { dir: 'right', turns: FOUR, anim: 'pop-draw' }),
    icon('chevron-circle-right', 'Chevron Circle Right', ['chevron', 'circle', 'next', 'right', 'expand'], [body(C(12, 12, 8.5)), accent(poly([[10.5, 8.5], [14, 12], [10.5, 15.5]], 0.8))], { dir: 'right', turns: FOUR, anim: 'pop-draw' }),
    icon('undo', 'Undo', ['back', 'revert', 'history', 'return'], [line('M5.5 9h9a5 5 0 0 1 0 10H9'), line(head(5, 9, 180, 4))], { mirror: { name: 'redo', title: 'Redo', tags: ['forward', 'repeat', 'history', 'again'] }, anim: { preset: 'nudge', dir: [-1, 0], dist: 1.5 } }),
    icon('swap-horizontal', 'Swap Horizontal', ['exchange', 'switch', 'transfer', 'trade', 'arrows'], [line(L(5, 8.5, 18.5, 8.5)), line(head(19, 8.5, 0, 3.5)), line(L(19, 15.5, 5.5, 15.5)), line(head(5, 15.5, 180, 3.5))], { variants: [{ name: 'swap-vertical', title: 'Swap Vertical', tags: ['exchange', 'sort', 'order', 'arrows'], els: [line(L(8.5, 19, 8.5, 5.5)), line(head(8.5, 5, -90, 3.5)), line(L(15.5, 5, 15.5, 18.5)), line(head(15.5, 19, 90, 3.5))] }], anim: 'pop-draw' }),
    icon('trend-up', 'Trend Up', ['growth', 'increase', 'chart', 'rise', 'profit'], [line(poly([[3.5, 17], [9, 11.5], [12.5, 15], [19.5, 8]], 1.1)), line(poly([[15, 7.5], [20, 7.5], [20, 12.5]], 0.8))], { mirror: { name: 'trend-down', title: 'Trend Down', tags: ['decline', 'decrease', 'chart', 'fall', 'loss'], axis: 'y' }, anim: 'pop-draw' }),
    icon('refresh', 'Refresh', ['reload', 'sync', 'update', 'repeat', 'rotate'], [...arcArrow(12, 12, 7.5, 195, 330, 3).map((d) => line(d)), ...arcArrow(12, 12, 7.5, 15, 150, 3).map((d) => line(d))], { anim: 'spin' }),
    icon('rotate-cw', 'Rotate Clockwise', ['rotate', 'redo', 'turn', 'clockwise'], [...arcArrow(12, 12, 7.5, 110, 395).map((d) => line(d)), accent(C(12, 12, 1.2))], { mirror: { name: 'rotate-ccw', title: 'Rotate Counter-Clockwise', tags: ['rotate', 'undo', 'turn', 'anticlockwise'] }, anim: 'spin' }),
    icon('expand', 'Expand', ['fullscreen', 'enlarge', 'arrows', 'outward', 'resize'], [line(L(14, 10, 19, 5)), line(poly([[15, 4.8], [19.2, 4.8], [19.2, 9]], 0.7)), line(L(10, 14, 5, 19)), line(poly([[9, 19.2], [4.8, 19.2], [4.8, 15]], 0.7))], { variants: [{ name: 'collapse', title: 'Collapse', tags: ['shrink', 'minimize', 'arrows', 'inward', 'resize'], els: [line(L(14.5, 9.5, 19.5, 4.5)), line(poly([[14, 6], [14, 10], [18, 10]], 0.7)), line(L(9.5, 14.5, 4.5, 19.5)), line(poly([[10, 18], [10, 14], [6, 14]], 0.7))] }], anim: 'pulse' }),
    icon('move', 'Move', ['drag', 'arrows', 'position', 'pan', 'cross'], [line(L(12, 4.5, 12, 19.5)), line(L(4.5, 12, 19.5, 12)), line(head(12, 4, -90, 2.5)), line(head(12, 20, 90, 2.5)), line(head(4, 12, 180, 2.5)), line(head(20, 12, 0, 2.5))], { anim: 'pulse' }),
    icon('corner-down-right', 'Corner Down Right', ['return', 'reply', 'indent', 'turn'], [line('M5.5 4.5v6a4 4 0 0 0 4 4h9.5'), line(head(19.5, 14.5, 0, 4))], { dir: 'right', mirror: { name: 'corner-down-left', title: 'Corner Down Left', tags: ['return', 'enter', 'reply', 'turn'] }, anim: nudge(1.5) }),
  ],
};
