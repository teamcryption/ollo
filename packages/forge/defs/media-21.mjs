import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('sharp-sign', 'Sharp', ['music sharp', 'accidental', 'note', 'key signature', 'semitone up'], [line('M9.5 4.5v15M14.5 4.5v15M5.5 10l13-2.5M5.5 16.5l13-2.5')], { noAccent: true }),
    icon('flat-sign', 'Flat', ['music flat', 'accidental', 'note', 'key signature', 'semitone down'], [line('M8 3.5V20c4-1.5 8-3.5 8-6.5 0-2.5-2.5-3.5-4.5-2.8S8 13 8 13')], { noAccent: true }),
    icon('natural-sign', 'Natural', ['music natural', 'accidental', 'note', 'cancel', 'key signature'], [line('M8.5 4v11.5l7-2M15.5 20V8.5l-7 2')], { noAccent: true }),
    icon('bass-clef', 'Bass Clef', ['f clef', 'music', 'notation', 'low notes', 'stave'], [line('M5 9a5 5 0 0 1 10 0c0 6-5 9.5-10 11'), body(C(6.5, 9.2, 1.7)), body(C(18.5, 7.5, 1.2)), body(C(18.5, 12, 1.2))], { noAccent: true }),
  ],
};
