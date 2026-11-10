import { icon, body, line } from '../src/dsl.mjs';
import { R, C, rotateD } from '../src/geo.mjs';

export default {
  category: 'gaming',
  icons: [
    icon('cannon', 'Cannon', ['artillery', 'pirate', 'fire', 'battle', 'castle defence'], [body(rotateD(R(3.5, 7.5, 14, 6, 3), -20, 10.5, 10.5)), body(C(9, 16, 3.5), { cover: true }), line(C(9, 16, 1.2))], { noAccent: true }),
  ],
};
