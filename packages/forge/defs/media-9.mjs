import { C, E, L, R, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const maraca = (deg) => [line(rotateD(L(12, 11.6, 12, 20.5), deg, 12, 18)), body(rotateD(E(12, 8, 3, 3.6), deg, 12, 18)), line(rotateD(L(9.3, 8.5, 14.7, 8.5), deg, 12, 18))];

export default {
  category: 'media',
  icons: [
    icon('maracas', 'Maracas', ['shaker', 'percussion', 'music', 'instrument', 'latin', 'rhythm'], [...maraca(-30), ...maraca(30)], { noAccent: true }),
    icon('xylophone', 'Xylophone', ['glockenspiel', 'percussion', 'music', 'instrument', 'mallet', 'notes'], [body(R(3, 4.5, 2, 15, 1)), body(R(6.8, 5.5, 2, 13, 1)), body(R(10.6, 6.5, 2, 11, 1)), body(R(14.4, 7.5, 2, 9, 1)), accent(L(19.25, 7, 18.6, 20.5) + C(19.4, 5.5, 1.5))]),
    icon('harmonica', 'Harmonica', ['mouth organ', 'blues', 'music', 'instrument', 'folk'], [body(R(3, 7.5, 18, 9, 1.5)), line(L(3, 10.5, 21, 10.5)), line('M6 12.8v1.6M9 12.8v1.6M12 12.8v1.6M15 12.8v1.6M18 12.8v1.6')], { noAccent: true }),
  ],
};
