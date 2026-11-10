import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, L } from '../src/geo.mjs';

export default {
  category: 'actions',
  icons: [
    icon('multi-select', 'Multi-select', ['select many', 'bulk select', 'checkboxes', 'batch', 'choose'], [line('M8 4h9.5A2.5 2.5 0 0 1 20 6.5V16'), body(R(4, 8, 12, 12, 2.5), { cover: true }), accent('M7.5 14l2 2 3.5-4')]),
  ],
};
