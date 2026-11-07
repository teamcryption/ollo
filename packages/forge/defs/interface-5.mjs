import { R, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'interface',
  icons: [
    icon('sidebar-collapse', 'Collapse Sidebar', ['hide panel', 'close sidebar', 'drawer', 'navigation panel'], [body(R(3.5, 4, 17, 16, 2.5)), line(L(9, 4.2, 9, 19.8)), accent('M15 9.5 12.5 12l2.5 2.5')], { mirror: { name: 'sidebar-expand', title: 'Expand Sidebar', tags: ['show panel', 'open sidebar', 'drawer', 'navigation panel'] } }),
    icon('segmented-control', 'Segmented Control', ['tabs', 'toggle group', 'switch', 'options', 'segment'], [body(R(3, 8, 18, 8, 3)), line(L(12, 8.2, 12, 15.8)), accent(L(6, 12, 9, 12)), line(L(15, 12, 18, 12))]),
  ],
};
