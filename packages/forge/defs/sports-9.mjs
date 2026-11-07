import { C, L } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'sports',
  icons: [
    icon('fishing-rod', 'Fishing Rod', ['fishing', 'angling', 'hook', 'catch', 'outdoors', 'hobby'], [line(L(4, 20.5, 18, 4)), line('M18 4v9.5M18 13.5v3a2 2 0 0 1-4 0v-.5'), body(C(9.6, 16.6, 1.8), { cover: true })], { noAccent: true }),
    icon('roller-skate', 'Roller Skate', ['skating', 'quad', 'skate', 'rink', 'retro', 'wheels'], [body('M5 4.5h5v6l6 2.2c2.2.8 3.5 2.4 3.5 4.3H5Z'), line('M10 7.5h2M10 10h2'), body(C(7.8, 19, 1.5), { cover: true }), body(C(16.2, 19, 1.5), { cover: true })], { noAccent: true }),
  ],
};
