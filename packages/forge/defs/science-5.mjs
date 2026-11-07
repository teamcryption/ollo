import { E, D } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'science',
  icons: [
    icon('ufo', 'UFO', ['flying saucer', 'alien ship', 'space', 'sci-fi', 'unidentified'], [body(E(12, 13, 9, 3)), body('M7.5 11.5a4.5 4.5 0 0 1 9 0Z', { cover: true }), line(D(8, 13)), line(D(12, 13.5)), line(D(16, 13)), line('M9 17.5l-2 3M15 17.5l2 3')], { noAccent: true, anim: { preset: 'bounce', dist: -1 } }),
  ],
};
