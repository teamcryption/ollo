import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'food',
  icons: [
    icon('steamer', 'Bamboo Steamer', ['dim sum', 'dumplings', 'steam basket', 'asian cooking', 'kitchen'], [body('M4 10c0-1.7 3.6-3 8-3s8 1.3 8 3v7.5c0 1.7-3.6 3-8 3s-8-1.3-8-3Z'), line('M4.2 10c0 1.7 3.6 3 7.8 3s7.8-1.3 7.8-3M4.2 14.5c0 1.7 3.6 3 7.8 3s7.8-1.3 7.8-3'), accent('M9 3v1.5M12 3v1.5M15 3v1.5')]),
  ],
};
