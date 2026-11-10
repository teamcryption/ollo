import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, star, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));


export default {
  category: 'devices',
  icons: [
    icon('nas', 'NAS', ['network storage', 'file server', 'backup', 'drives', 'home server'], [body(R(5, 3.5, 14, 17, 2)), line(R(7.5, 6, 9, 4, 0.8) + R(7.5, 11.5, 9, 4, 0.8)), line(D(9, 17.8) + D(12, 17.8))], { noAccent: true }),
  ],
};
