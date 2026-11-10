import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));


export default {
  category: 'logistics',
  icons: [
    icon('scaffolding', 'Scaffolding', ['construction', 'building site', 'frame', 'renovation', 'structure'], [line('M5 3.5v17M12 3.5v17M19 3.5v17M5 8.5h14M5 14.5h14M5 14.5l7-6M12 20.5l7-6')], { noAccent: true }),
  ],
};
