import { R, L, D, E, poly } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'animals',
  icons: [
    icon('penguin', 'Penguin', ['antarctic', 'bird', 'cold', 'winter', 'polar'], [body(R(6, 3, 12, 17.5, 6)), line(E(12, 15.3, 3.3, 3.8)), line(D(10, 7.5)), line(D(14, 7.5)), line(poly([[11.2, 9.2], [12.8, 9.2], [12, 10.4]], 0.2, true))], { noAccent: true, anim: 'wiggle' }),
    icon('crab', 'Crab', ['seafood', 'beach', 'claw', 'crustacean', 'cancer'], [body(E(12, 14, 6, 3.5)), line('M7 11.5 5 8.5M5 8.5 3.5 5.5M5 8.5l2-3'), line('M17 11.5l2-3M19 8.5l1.5-3M19 8.5l-2-3'), line('M6.5 16l-3 2M7.5 17.3l-2 2.7M17.5 16l3 2M16.5 17.3l2 2.7'), line('M10.5 10.5v-2M13.5 10.5v-2')], { noAccent: true }),
    icon('frog', 'Frog', ['toad', 'amphibian', 'pond', 'jump', 'green'], [body('M4 15c0-4 3.5-6.5 8-6.5s8 2.5 8 6.5-3.5 5.5-8 5.5-8-1.5-8-5.5Z'), body(E(8, 8, 2.5, 2.5), { cover: true }), body(E(16, 8, 2.5, 2.5), { cover: true }), line(D(8, 8)), line(D(16, 8)), line('M8 15.5c2.5 1.5 5.5 1.5 8 0')], { noAccent: true, anim: { preset: 'bounce', dist: -1 } }),
  ],
};
