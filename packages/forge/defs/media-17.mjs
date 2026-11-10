import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, poly, rotateD } from '../src/geo.mjs';

export default {
  category: 'media',
  icons: [
    icon('harp', 'Harp', ['strings', 'classical', 'orchestra', 'angelic', 'instrument'], [line('M6 20.5V4c3 0 5 2 7.5 2.5S18 6 19.5 4.5'), body(poly([[19, 4.2], [20.6, 5.8], [8.2, 20.5], [5.8, 20.5]], 0.6, true), { cover: true }), line('M9 6v11M12 6.8v6.6M15 7v3')], { noAccent: true }),
  ],
};
