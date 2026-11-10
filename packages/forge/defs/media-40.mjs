import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('film-pencil', 'Edit Film', ['edit', 'write', 'modify', 'film', 'film'], [body(R(4, 3.5, 11, 14, 1.5)), line('M6.5 3.7v13.6M12.5 3.7v13.6M4.2 10.5h2.3M12.5 10.5h2.3'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('camera-pencil', 'Edit Camera', ['edit', 'write', 'modify', 'camera', 'camera'], [body(R(3, 6.5, 13, 10, 2)), line('M7 6.5 8 4.5h3l1 2'), line(C(9.5, 11.5, 2.5)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('music-pencil', 'Edit Music', ['edit', 'write', 'modify', 'music', 'music'], [line('M8 15.5V5.5l7-2v9.5'), body(C(6, 15.5, 2)), body(C(13, 13, 2)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('guitar-pencil', 'Edit Guitar', ['edit', 'write', 'modify', 'guitar', 'guitar'], [line('M10.5 8.5 15.5 3.5'), body('M8.7 7.3a2.6 2.6 0 0 1 3.7 3.7c-.6.6-1 1.1-.9 2a3.6 3.6 0 1 1-4.8-4.8c.9.1 1.4-.3 2-.9Z'), line(D(7.6, 13)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('drum-pencil', 'Edit Drum', ['edit', 'write', 'modify', 'drum', 'drum'], [body('M3.5 8.5v6c0 1.7 2.7 3 6 3s6-1.3 6-3v-6'), line(E(9.5, 8.5, 6, 2.5)), line('M3 3.5l5 4M16 3.5l-5 4'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('radio-pencil', 'Edit Radio', ['edit', 'write', 'modify', 'radio', 'radio'], [line('M5 7 12.5 3.5'), body(R(3, 7, 13, 10, 2)), line(C(7.5, 12, 2.2)), line('M12 10h1.5M12 12.5h1.5'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
