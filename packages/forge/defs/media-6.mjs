import { R, C } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'media',
  icons: [
    icon('tv-retro', 'Retro TV', ['television', 'vintage tv', 'crt', 'old tv', 'broadcast'], [line('M8 3.5 12 7l4-3.5'), body(R(3.5, 7, 17, 13, 2.5)), line(R(6, 9.5, 8, 8, 1.5)), accent(C(17.3, 11.5, 1.1)), line('M17.3 15v1.5')]),
  ],
};
