import { icon, line, accent } from '../src/dsl.mjs';
import { translateD } from '../src/geo.mjs';

export default {
  category: 'accessibility',
  icons: [
    icon('hearing-loop', 'Hearing Loop', ['induction loop', 't-coil', 'hearing aid', 'assistive listening', 'accessibility'], [line(translateD('M7 9a5 5 0 0 1 10 0c0 3.2-3.2 3.8-3.2 7a2.6 2.6 0 0 1-5.2.4', -2.5, 0)), accent('M15.5 14.5H20M17.75 14.5V20')]),
  ],
};
