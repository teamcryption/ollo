import { R } from '../src/geo.mjs';
import { icon, line, accent } from '../src/dsl.mjs';

export default {
  category: 'gaming',
  icons: [
    icon('level-up', 'Level Up', ['upgrade', 'rank up', 'progress', 'promotion', 'xp'], [line(R(3.5, 3.5, 17, 17, 3)), line('M8 16.5l4-4 4 4'), accent('M8 12l4-4 4 4')], { anim: { preset: 'bounce', dist: -1 } }),
  ],
};
