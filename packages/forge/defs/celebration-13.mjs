import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const hex = (cx, cy, r) => poly([0, 1, 2, 3, 4, 5].map((k) => { const a = (-90 + 60 * k) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }), 1, true);
const drop = (x) => 'M' + x + ' 9c1.4 1.8 2 3 2 4a2 2 0 0 1-4 0c0-1 .6-2.2 2-4Z';

export default {
  category: 'celebration',
  icons: [
    icon('confetti', 'Confetti', ['party', 'celebrate', 'festive', 'streamers', 'congratulations'], [body(rotateD(R(5, 5, 2.5, 4, 0.6), 30, 6.25, 7)), body(rotateD(R(15.5, 14, 2.5, 4, 0.6), -35, 16.75, 16)), line('M14 5c1 1 2 0 3 1s2 0 3 1M4 15c1 1 2 0 3 1s2 0 3 1'), line(D(19, 10.5) + D(8, 20) + D(13, 20)), accent(star(11.5, 11.5, 2.2, 0.9, 5, 0.3))]),
    icon('disco-ball', 'Disco Ball', ['mirror ball', 'party', 'dance', 'club', 'night out'], [line('M12 3.5V6'), body(C(12, 13, 7)), line('M5.2 11h13.6M5.2 15h13.6M12 6.2v13.6'), accent(star(19, 4.5, 1.6, 0.5, 4, 0.2))]),
  ],
};
