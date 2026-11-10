import { icon, body, line } from '../src/dsl.mjs';
import { R, C, D } from '../src/geo.mjs';

export default {
  category: 'design',
  icons: [
    icon('wireframe', 'Wireframe', ['mockup', 'layout sketch', 'prototype', 'ux', 'page structure'], [body(R(3.5, 4, 17, 16, 2.5)), line('M3.7 8h16.6'), line(R(6.5, 10.5, 5, 6.5, 1)), line('M14 11h3.5M14 14h3.5M14 17h2')], { noAccent: true }),
  ],
};
