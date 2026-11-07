import { L } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'sports',
  icons: [
    icon('boxing-glove', 'Boxing Glove', ['boxing', 'fight', 'punch', 'martial arts', 'combat'], [body('M7 20.5V16C5 14.5 4.5 12.5 4.5 10V8A4.5 4.5 0 0 1 9 3.5h5A5.5 5.5 0 0 1 19.5 9v3c0 2.5-1 4-2.5 4.5v4Z'), line(L(7.2, 16.5, 16.8, 16.5)), line('M4.6 10.5c2 0 4 .5 5 2')], { noAccent: true, anim: { preset: 'nudge', dir: [1, 0], dist: 1 } }),
  ],
};
