import { R, C, L, A, poly, head, D } from '../src/geo.mjs';
import { icon, body, line, accent, turnEls } from '../src/dsl.mjs';

const COLS = [body(R(3.5, 4, 17, 16, 2.5)), line(L(12, 4.2, 12, 19.8))];
const CURSOR = poly([[5, 4], [19, 10.5], [12.6, 12.6], [10.5, 19]], 1.2, true);

export default {
  category: 'interface',
  icons: [
    icon('slider', 'Slider', ['range', 'volume', 'adjust', 'control', 'input'], [line(L(3.5, 12, 20.5, 12)), body(C(9, 12, 2.8), { cover: true })], { noAccent: true, anim: { preset: 'nudge', dir: [1, 0], dist: 2 } }),
    icon('tabs', 'Tabs', ['browser', 'pages', 'navigation', 'sections'], [body(R(3.5, 7, 17, 13, 2.5)), line('M3.7 7V5.5A1.5 1.5 0 0 1 5.2 4h4.6a1.5 1.5 0 0 1 1.5 1.5V7'), accent(L(7, 12, 12, 12))]),
    icon('columns', 'Columns', ['layout', 'split', 'two columns', 'grid'], COLS, { noAccent: true, variants: [{ name: 'rows', title: 'Rows', tags: ['layout', 'split', 'two rows', 'stack'], els: turnEls(COLS, 90) }] }),
    icon('layout-top', 'Header Layout', ['layout', 'header', 'navbar', 'page'], [body(R(3.5, 4, 17, 16, 2.5)), line(L(3.7, 9, 20.3, 9)), accent(L(7, 13, 13, 13))]),
    icon('minimize', 'Minimize', ['exit fullscreen', 'shrink', 'collapse', 'reduce'], [line(poly([[4, 9], [9, 9], [9, 4]], 0.8)), line(poly([[15, 4], [15, 9], [20, 9]], 0.8)), line(poly([[20, 15], [15, 15], [15, 20]], 0.8)), line(poly([[9, 20], [9, 15], [4, 15]], 0.8))], { noAccent: true, anim: 'pulse' }),
    icon('sort-ascending', 'Sort Ascending', ['sort', 'order', 'a-z', 'ascending', 'arrange'], [line(L(4, 6.5, 8, 6.5)), line(L(4, 12, 10.5, 12)), line(L(4, 17.5, 13, 17.5)), line(L(18, 5, 18, 18.5)), line(head(18, 19, 90, 4))], { noAccent: true, mirror: { name: 'sort-descending', title: 'Sort Descending', tags: ['sort', 'order', 'z-a', 'descending', 'arrange'], axis: 'y' } }),
    icon('tooltip', 'Tooltip', ['hint', 'popover', 'info', 'bubble', 'help'], [body('M6 4h12a2.5 2.5 0 0 1 2.5 2.5v6A2.5 2.5 0 0 1 18 15h-4l-2 2.5-2-2.5H6a2.5 2.5 0 0 1-2.5-2.5v-6A2.5 2.5 0 0 1 6 4Z'), accent(L(8, 9.5, 16, 9.5))]),
    icon('infinity', 'Infinity', ['loop', 'endless', 'forever', 'unlimited'], [line('M12 12c-2-2.5-3.5-4-5.5-4a4 4 0 0 0 0 8c2 0 3.5-1.5 5.5-4s3.5-4 5.5-4a4 4 0 0 1 0 8c-2 0-3.5-1.5-5.5-4Z')], { noAccent: true, anim: 'pop-draw' }),
    icon('circle-dashed', 'Circle Dashed', ['placeholder', 'empty', 'draft', 'pending'], [0, 45, 90, 135, 180, 225, 270, 315].map((a) => line(A(12, 12, 8.5, a + 8, a + 30))), { noAccent: true, anim: 'spin' }),
    icon('cursor-click', 'Click', ['cursor', 'click', 'tap', 'select', 'pointer'], [body(poly([[9, 8], [20, 13], [15, 14.7], [13.3, 19.7]], 1, true)), line(L(5.5, 5.5, 4, 4)), line(L(9, 3.5, 9, 5.2)), accent(L(3.5, 9, 5.2, 9))]),
    icon('list-tree', 'Tree List', ['hierarchy', 'nested', 'outline', 'structure'], [line('M6 4v12.5a2 2 0 0 0 2 2h4'), line(L(6, 10, 12, 10)), body(R(14, 8, 6.5, 4, 1.2)), body(R(14, 16.5, 6.5, 4, 1.2))], { noAccent: true }),
    icon('apps-add', 'Add App', ['apps', 'widget', 'add', 'grid', 'new'], [body(R(4, 4, 7, 7, 2)), body(R(13, 4, 7, 7, 2)), body(R(4, 13, 7, 7, 2)), accent('M16.5 13.5v6M13.5 16.5h6')]),
  ],
};
