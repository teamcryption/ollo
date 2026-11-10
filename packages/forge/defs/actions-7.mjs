import { icon, body, line } from '../src/dsl.mjs';
import { poly, translateD } from '../src/geo.mjs';

const HAND = 'M10 20.5l-3.2-4.3a1.4 1.4 0 0 1 2.1-1.8l1.6 1.6V9a1.5 1.5 0 0 1 3 0v4.5l3.6.7a2 2 0 0 1 1.6 2.2l-.5 4.1Z';

export default {
  category: 'actions',
  icons: [
    icon('swipe', 'Swipe', ['gesture', 'slide', 'scroll sideways', 'drag finger', 'touch'], [body(translateD(HAND, 0, 0.5)), line('M6.5 5h11M8.3 3.2 6.5 5l1.8 1.8M15.7 3.2 17.5 5l-1.8 1.8')], { noAccent: true }),
    icon('select-area', 'Select Area', ['marquee', 'region', 'drag select', 'area', 'box select'], [line('M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M11 4h2M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M4 11v2M4 16v2.5A1.5 1.5 0 0 1 5.5 20H8M11 20h.5'), body(poly([[13.5, 13.5], [20.5, 16], [17.5, 17.3], [16, 20.5]], 0.6, true))], { noAccent: true }),
    icon('reorder', 'Reorder', ['rearrange', 'move items', 'sort list', 'drag order', 'priority'], [line('M4 6h9M4 12h9M4 18h9'), line('M17.5 5v14M15.5 7l2-2 2 2M15.5 17l2 2 2-2')], { noAccent: true }),
  ],
};
