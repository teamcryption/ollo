import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'food',
  icons: [
    icon('ramen', 'Ramen', ['noodles', 'soup', 'bowl', 'chopsticks', 'japanese'], [line('M10 9.5 17.5 3.5M12.5 10.5l7.5-5.5'), body('M3.5 11.5h17c0 5-3.8 8.5-8.5 8.5S3.5 16.5 3.5 11.5Z')], { noAccent: true }),
  ],
};
