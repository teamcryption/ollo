import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));


export default {
  category: 'home',
  icons: [
    icon('fuse-box', 'Fuse Box', ['breaker panel', 'circuit breaker', 'electrical', 'power', 'utility'], [body(R(4.5, 3.5, 15, 17, 2)), line(R(7.5, 7, 3, 4, 0.6) + R(13.5, 7, 3, 4, 0.6) + R(7.5, 13, 3, 4, 0.6) + R(13.5, 13, 3, 4, 0.6))], { noAccent: true }),
    icon('storage-box', 'Storage Box', ['tote', 'container', 'bin', 'organize', 'moving'], [body(R(3.5, 5.5, 17, 3.5, 1)), body(poly([[5, 9.5], [19, 9.5], [18, 20.5], [6, 20.5]], 1.5, true)), line('M10 13.5h4')], { noAccent: true }),
  ],
};
