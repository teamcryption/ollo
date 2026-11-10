import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'text',
  icons: [
    icon('letter-a', 'Letter A', ['a', 'letter', 'alphabet', 'initial', 'character'], [line('M6.5 19.5 12 4.5l5.5 15M8.4 14.5h7.2')], { noAccent: true, containers: ['circle', 'square'] }),
    icon('letter-b', 'Letter B', ['b', 'letter', 'alphabet', 'initial', 'character'], [line('M7.5 19.5v-15h5a3.6 3.6 0 0 1 0 7.2h-5m5 0a3.9 3.9 0 0 1 0 7.8h-5')], { noAccent: true }),
    icon('letter-c', 'Letter C', ['c', 'letter', 'alphabet', 'initial', 'character'], [line('M17 7.2A6.5 7.5 0 1 0 17 16.8')], { noAccent: true, containers: ['circle', 'square'] }),
    icon('letter-d', 'Letter D', ['d', 'letter', 'alphabet', 'initial', 'character'], [line('M7 4.5h4a6.5 7.5 0 0 1 0 15H7Z')], { noAccent: true, containers: ['circle', 'square'] }),
    icon('letter-e', 'Letter E', ['e', 'letter', 'alphabet', 'initial', 'character'], [line('M16.5 4.5h-9v15h9M7.5 12h7')], { noAccent: true, containers: ['circle', 'square'] }),
    icon('letter-f', 'Letter F', ['f', 'letter', 'alphabet', 'initial', 'character'], [line('M16.5 4.5h-9v15M7.5 12h7')], { noAccent: true, containers: ['circle', 'square'] }),
    icon('letter-g', 'Letter G', ['g', 'letter', 'alphabet', 'initial', 'character'], [line('M17 7.2A6.5 7.5 0 1 0 18.5 12H13')], { noAccent: true, containers: ['circle', 'square'] }),
    icon('letter-h', 'Letter H', ['h', 'letter', 'alphabet', 'initial', 'character'], [line('M7 4.5v15M17 4.5v15M7 12h10')], { noAccent: true, containers: ['circle', 'square'] }),
    icon('letter-i', 'Letter I', ['i', 'letter', 'alphabet', 'initial', 'character'], [line('M12 4.5v15M9 4.5h6M9 19.5h6')], { noAccent: true, containers: ['circle', 'square'] }),
    icon('letter-j', 'Letter J', ['j', 'letter', 'alphabet', 'initial', 'character'], [line('M15 4.5V15a4.5 4.5 0 0 1-9 0')], { noAccent: true, containers: ['circle', 'square'] }),
    icon('letter-k', 'Letter K', ['k', 'letter', 'alphabet', 'initial', 'character'], [line('M7.5 4.5v15M17 4.5l-9.5 9M10.5 11l6.5 8.5')], { noAccent: true, containers: ['circle', 'square'] }),
    icon('letter-l', 'Letter L', ['l', 'letter', 'alphabet', 'initial', 'character'], [line('M7.5 4.5v15h9')], { noAccent: true, containers: ['circle', 'square'] }),
    icon('letter-m', 'Letter M', ['m', 'letter', 'alphabet', 'initial', 'character'], [line('M5.5 19.5v-15l6.5 9 6.5-9v15')], { noAccent: true }),
  ],
};
