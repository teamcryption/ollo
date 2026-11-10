import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, star, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'tools',
  icons: [
    icon('allen-key', 'Allen Key', ['hex key', 'wrench', 'furniture assembly', 'hardware', 'tool'], [body('M6.5 3.5H9v11.5a1.5 1.5 0 0 0 1.5 1.5H18v2.5h-7.5a4 4 0 0 1-4-4Z')], { noAccent: true }),
    icon('squeegee', 'Squeegee', ['window cleaner', 'wiper', 'cleaning', 'glass', 'scraper'], [body(R(4, 4, 16, 3.5, 1)), line('M5 9h14'), body(R(10.8, 9, 2.4, 11.5, 1.2))], { noAccent: true }),
  ],
};
