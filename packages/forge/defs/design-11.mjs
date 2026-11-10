import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, poly } from '../src/geo.mjs';

export default {
  category: 'design',
  icons: [
    icon('stencil', 'Stencil', ['template', 'cut out shapes', 'drafting', 'shape guide', 'craft'], [body(R(3.5, 5, 17, 14, 2.5)), line(C(8.5, 12, 2.5)), line(poly([[13, 14.5], [15.5, 9.5], [18, 14.5]], 0.5, true))], { noAccent: true }),
    icon('gift-tag', 'Gift Tag', ['present label', 'tag', 'to from', 'holiday', 'gift'], [body(poly([[8, 8.5], [12, 5], [16, 8.5], [16, 20.5], [8, 20.5]], 1.2, true)), line(C(12, 9.5, 1.2)), line('M12 8.3C11 6 9 4 6 3.5'), accent('M10 15.5h4')]),
  ],
};
