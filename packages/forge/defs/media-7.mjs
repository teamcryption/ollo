import { C, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const H = [0, 72, 144, 216, 288].map((a) => [11 + 3.9 * Math.cos(((a - 90) * Math.PI) / 180), 11 + 3.9 * Math.sin(((a - 90) * Math.PI) / 180)]);

export default {
  category: 'media',
  icons: [
    icon('film-reel', 'Film Reel', ['reel', 'cinema', 'movie', 'footage', 'projector'], [body(C(11, 11, 7.3)), ...H.map(([x, y]) => line(C(x, y, 1.4))), line('M11 18.3h9.5'), accent(D(11, 11))]),
  ],
};
