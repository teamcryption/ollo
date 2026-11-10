import { icon, body, line } from '../src/dsl.mjs';
import { R, C, E } from '../src/geo.mjs';

export default {
  category: 'sports',
  icons: [
    icon('gym-rings', 'Gymnastic Rings', ['still rings', 'gymnastics', 'calisthenics', 'workout', 'olympics'], [line('M8 3.5v8M16 3.5v8'), line(C(8, 15, 3.5)), line(C(16, 15, 3.5))], { noAccent: true }),
  ],
};
