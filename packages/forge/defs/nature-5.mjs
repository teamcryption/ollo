import { C, E } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'nature',
  icons: [
    icon('wood-log', 'Wood Log', ['log', 'timber', 'firewood', 'lumber', 'tree trunk'], [line('M6.5 7.5H16a4.5 4.5 0 0 1 0 9H6.5'), line('M11 10.5h4M13 13.5h4'), body(E(6.5, 12, 3, 4.5)), accent(C(6.5, 12, 0.8))]),
  ],
};
