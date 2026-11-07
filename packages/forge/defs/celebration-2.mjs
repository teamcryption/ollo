import { R, C, L, A, poly, D, E, star, rotateD, mirrorD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const LOOP = 'M12 11.5c-2.5-3-7.5-4.5-7.5-1.5 0 3 5 3.5 7.5 1.5Z';
const flute = (x, deg) => [
  body(rotateD(`M${x - 2} 3.5h4l-.4 6.2a1.6 1.6 0 0 1-3.2 0Z`, deg, x, 12)),
  line(rotateD(L(x, 11.3, x, 18.5), deg, x, 12)),
  line(rotateD(L(x - 2, 18.5, x + 2, 18.5), deg, x, 12)),
];

export default {
  category: 'celebration',
  icons: [
    icon('party-hat', 'Party Hat', ['birthday', 'party', 'celebrate', 'cone'], [body(poly([[12, 3.5], [18, 19.5], [6, 19.5]], 1, true)), line(L(9.8, 9.5, 14.2, 9.5)), line(L(8, 14.5, 16, 14.5))], { noAccent: true, anim: 'wiggle' }),
    icon('champagne', 'Champagne', ['toast', 'cheers', 'celebrate', 'new year', 'glasses'], [...flute(8, -12), ...flute(16, 12), accent(D(12, 3.5))]),
    icon('candle', 'Candle', ['birthday candle', 'light', 'memorial', 'flame'], [accent('M12 3.5c1.2 1.3 1.8 2.3 1.8 3.2a1.8 1.8 0 0 1-3.6 0c0-.9.6-1.9 1.8-3.2Z'), body(R(9, 10.5, 6, 9, 1.5)), line(L(6.5, 20.5, 17.5, 20.5))], { anim: 'wiggle' }),
    icon('lantern', 'Lantern', ['paper lantern', 'festival', 'lunar new year', 'light'], [line(L(12, 3, 12, 6)), body(E(12, 12.5, 6, 6.5)), line(E(12, 12.5, 2.5, 6.5)), line(L(12, 19.2, 12, 21))], { noAccent: true, anim: 'wiggle' }),
    icon('pumpkin', 'Pumpkin', ['halloween', 'autumn', 'harvest', 'jack o lantern'], [line('M12 7.2V5a2 2 0 0 1 2-2'), body(E(12, 13.5, 8.5, 6.5)), line(E(12, 13.5, 3.5, 6.5))], { noAccent: true }),
    icon('easter-egg', 'Easter Egg', ['easter', 'egg', 'spring', 'decorated'], [body('M12 3.5c3.5 0 6.5 5.5 6.5 10a6.5 6.5 0 0 1-13 0c0-4.5 3-10 6.5-10Z'), line(poly([[5.7, 12.5], [8, 10.5], [10, 12.5], [12, 10.5], [14, 12.5], [16, 10.5], [18.3, 12.5]], 0.3)), accent(D(12, 16.5))]),
    icon('ornament', 'Ornament', ['bauble', 'christmas', 'decoration', 'holiday'], [line(R(10, 4, 4, 2.5, 0.5)), body(C(12, 13.5, 7)), accent(star(12, 13.5, 3, 1.3, 5, 0.3))]),
    icon('gift-bow', 'Bow', ['ribbon', 'gift', 'present', 'wrap'], [body(LOOP), body(mirrorD(LOOP)), line('M11 12.5 8 19'), line('M13 12.5l3 6.5'), body(C(12, 11.8, 1.3))], { noAccent: true }),
  ],
};
