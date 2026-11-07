import { R, L, poly } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'interface',
  icons: [
    icon('breadcrumb', 'Breadcrumb', ['path', 'navigation trail', 'hierarchy', 'location', 'crumbs'], [line(R(3.5, 10, 5, 4, 1.5)), line('M10 10.2l1.8 1.8-1.8 1.8'), accent(R(13.8, 10, 6.7, 4, 1.5))]),
    icon('drag-drop', 'Drag and Drop', ['drop zone', 'move', 'dragging', 'upload area'], [line('M4 7V5.5A1.5 1.5 0 0 1 5.5 4H7M9.5 4h2M14 4h.5A1.5 1.5 0 0 1 16 5.5V7M16 9.5v1M4 9.5v2M4 14v.5A1.5 1.5 0 0 0 5.5 16H7M9.5 16h1'), accent(poly([[12.5, 12.5], [20, 15], [16.5, 16.5], [15, 20]], 0.4, true))]),
    icon('scrollbar', 'Scrollbar', ['scroll', 'overflow', 'page', 'window', 'scroll area'], [body(R(3.5, 4, 17, 16, 2.5)), line(L(16, 4.2, 16, 19.8)), line(L(7, 8, 12.5, 8)), line(L(7, 11.5, 12.5, 11.5)), line(L(7, 15, 10.5, 15)), accent(L(18.2, 7.5, 18.2, 11))]),
  ],
};
