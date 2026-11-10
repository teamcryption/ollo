import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'text',
  icons: [
    icon('letter-n', 'Letter N', ['n', 'letter', 'alphabet', 'initial', 'character'], [line('M7 19.5v-15l10 15v-15')], { noAccent: true, containers: ['circle', 'square'] }),
    icon('letter-o', 'Letter O', ['o', 'letter', 'alphabet', 'initial', 'character'], [line(E(12, 12, 6, 7.5))], { noAccent: true }),
    icon('letter-p', 'Letter P', ['p', 'letter', 'alphabet', 'initial', 'character'], [line('M7.5 19.5v-15h5a4 4 0 0 1 0 8h-5')], { noAccent: true, containers: ['circle', 'square'] }),
    icon('letter-q', 'Letter Q', ['q', 'letter', 'alphabet', 'initial', 'character'], [line(E(12, 11.5, 6, 7)), line('M14 15.5l4 4.5')], { noAccent: true, containers: ['circle', 'square'] }),
    icon('letter-r', 'Letter R', ['r', 'letter', 'alphabet', 'initial', 'character'], [line('M7.5 19.5v-15h5a4 4 0 0 1 0 8h-5m4.5 0 4.5 7')], { noAccent: true, containers: ['square'] }),
    icon('letter-s', 'Letter S', ['s', 'letter', 'alphabet', 'initial', 'character'], [line('M16.5 7c-.8-1.6-2.4-2.5-4.5-2.5-2.8 0-4.5 1.5-4.5 3.5s1.7 3 4.5 3.7 4.5 1.7 4.5 3.9-1.8 3.9-4.5 3.9c-2.3 0-4-1-4.8-2.6')], { noAccent: true, containers: ['square'] }),
    icon('letter-t', 'Letter T', ['t', 'letter', 'alphabet', 'initial', 'character'], [line('M5.5 4.5h13M12 4.5v15')], { noAccent: true, containers: ['circle'] }),
    icon('letter-u', 'Letter U', ['u', 'letter', 'alphabet', 'initial', 'character'], [line('M7 4.5V14a5 5 0 0 0 10 0V4.5')], { noAccent: true, containers: ['circle', 'square'] }),
    icon('letter-v', 'Letter V', ['v', 'letter', 'alphabet', 'initial', 'character'], [line('M6 4.5l6 15 6-15')], { noAccent: true, containers: ['circle', 'square'] }),
    icon('letter-w', 'Letter W', ['w', 'letter', 'alphabet', 'initial', 'character'], [line('M4 4.5l3.5 15L12 8l4.5 11.5L20 4.5')], { noAccent: true, containers: ['square'] }),
    icon('letter-x', 'Letter X', ['x', 'letter', 'alphabet', 'initial', 'character'], [line('M6.5 4.5l11 15M17.5 4.5l-11 15')], { noAccent: true, containers: ['circle', 'square'] }),
    icon('letter-y', 'Letter Y', ['y', 'letter', 'alphabet', 'initial', 'character'], [line('M6 4.5l6 7.5 6-7.5M12 12v7.5')], { noAccent: true, containers: ['circle', 'square'] }),
    icon('letter-z', 'Letter Z', ['z', 'letter', 'alphabet', 'initial', 'character'], [line('M6.5 4.5h11l-11 15h11')], { noAccent: true, containers: ['circle', 'square'] }),
  ],
};
