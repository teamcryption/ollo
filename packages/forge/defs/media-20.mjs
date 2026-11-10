import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('slow-motion', 'Slow Motion', ['slow mo', 'playback speed', 'video', 'replay', 'slow'], [body(poly([[10, 6], [19, 12], [10, 18]], 1.2, true)), accent('M3.5 9h3M3.5 12h4M3.5 15h3')]),
    icon('djembe', 'Djembe', ['drum', 'percussion', 'african drum', 'rhythm', 'music'], [body(poly([[6.5, 6.3], [17.5, 6.3], [14.5, 12], [16, 20.5], [8, 20.5], [9.5, 12]], 1, true)), body(E(12, 5.3, 6, 1.8), { cover: true })], { noAccent: true }),
  ],
};
