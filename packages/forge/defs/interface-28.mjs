import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'interface',
  icons: [
    icon('layout-two-thirds', 'Two Thirds Layout', ['asymmetric', 'columns', 'content and aside', 'layout', 'ui'], [body(R(3.5, 4.5, 17, 15, 2.5)), line('M14.5 4.7v14.6')], { noAccent: true }),
    icon('layout-header-sidebar', 'Header and Sidebar', ['app shell', 'dashboard layout', 'navigation', 'layout', 'ui'], [body(R(3.5, 4.5, 17, 15, 2.5)), line('M3.7 8.5h16.6M8.5 8.7v10.6')], { noAccent: true }),
    icon('layout-header-split', 'Header and Split', ['header', 'two panes', 'sections', 'layout', 'ui'], [body(R(3.5, 4.5, 17, 15, 2.5)), line('M3.7 9h16.6M12 9.2v10.1')], { noAccent: true }),
  ],
};
