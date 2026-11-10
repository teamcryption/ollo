import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, D, E } from '../src/geo.mjs';

export default {
  category: 'devices',
  icons: [
    icon('film-roll', 'Film Roll', ['35mm film', 'analogue camera', 'negative', 'photography', 'canister'], [body(R(13, 9, 7.5, 7, 0.5)), line(D(15, 10.6) + D(18, 10.6) + D(15, 14.4) + D(18, 14.4)), body(R(4, 6, 9, 13, 2), { cover: true }), line('M7 6V4h3v2')], { noAccent: true }),
    icon('network-switch', 'Network Switch', ['ethernet switch', 'lan', 'ports', 'networking', 'hub'], [body(R(3, 8, 18, 8, 2)), line('M5.5 10.75h2.5v2.5H5.5ZM9.5 10.75h2.5v2.5H9.5ZM13.5 10.75h2.5v2.5h-2.5Z'), line(D(18.5, 12))], { noAccent: true }),
  ],
};
