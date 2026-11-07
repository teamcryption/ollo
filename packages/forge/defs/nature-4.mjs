import { L } from '../src/geo.mjs';
import { icon, line } from '../src/dsl.mjs';

export default {
  category: 'nature',
  icons: [
    icon('grass', 'Grass', ['lawn', 'meadow', 'turf', 'field', 'blades'], [line(L(3.5, 20.5, 20.5, 20.5)), line('M6 20.5c0-4-1-7-2.5-9'), line('M9 20.5c0-5 1-9 3-12'), line('M14 20.5c0-4.5-.5-8-2-11'), line('M17.5 20.5c0-3.5 1-6 3-8')], { noAccent: true, anim: 'wiggle' }),
  ],
};
