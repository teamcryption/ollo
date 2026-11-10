import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'maps',
  icons: [
    icon('lamp-post', 'Lamp Post', ['street light', 'streetlamp', 'lantern', 'city', 'night'], [body('M10.5 3.5h3l2 2.5-1 3h-5l-1-3Z'), line('M12 9v11.5M9 20.5h6'), accent('M4 6.5h2M18 6.5h2')]),
  ],
};
