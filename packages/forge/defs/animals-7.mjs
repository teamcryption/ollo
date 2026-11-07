import { C, E, L, mirrorD } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

const LEGS = 'M9.3 12.4 6.5 9.5 5.5 6M8.9 14 5.5 13 3.5 10.5M9.2 15.5 6 16.5 4.5 19.5M10.2 16.8 8.5 19 8.5 21';

export default {
  category: 'animals',
  icons: [
    icon('snake', 'Snake', ['serpent', 'reptile', 'python', 'cobra', 'wildlife'], [line('M4 20h10.5a3 3 0 0 0 0-6h-5a3 3 0 0 1 0-6h5'), body(E(16.7, 8, 2.8, 2.2)), line(L(20, 8, 21, 8))], { noAccent: true }),
    icon('spider', 'Spider', ['arachnid', 'web', 'bug', 'insect', 'halloween', 'creepy'], [line(L(12, 3, 12, 6.6)), line(LEGS), line(mirrorD(LEGS)), body(C(12, 14, 3.2)), body(C(12, 8.4, 1.8), { cover: true })], { noAccent: true }),
  ],
};
