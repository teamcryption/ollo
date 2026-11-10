import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, poly, rotateD } from '../src/geo.mjs';

export default {
  category: 'maps',
  icons: [
    icon('fountain', 'Fountain', ['park', 'plaza', 'water feature', 'square', 'garden'], [body('M3.5 15h17l-2 5.5H5.5Z'), line('M12 15v-5'), body('M8 8h8a4 4 0 0 1-8 0Z'), accent('M12 6V3.5')]),
    icon('bench', 'Bench', ['park bench', 'seat', 'rest', 'park', 'outdoor'], [body(R(4, 4.5, 16, 2.2, 1) + R(4, 8, 16, 2.2, 1)), line('M6 6.7v6.3M18 6.7v6.3M6 15.5v5M18 15.5v5'), body(R(3.5, 13, 17, 2.5, 1))], { noAccent: true }),
    icon('picnic-table', 'Picnic Table', ['park', 'outdoor dining', 'bench', 'camping', 'bbq'], [body(R(3.5, 7, 17, 2.5, 1)), line('M8.5 9.5 6 20.5M15.5 9.5l2.5 11'), body(R(3, 14.5, 18, 2, 1), { cover: true })], { noAccent: true }),
    icon('swing', 'Swing', ['playground', 'swing set', 'kids', 'park', 'play'], [line('M4 20.5 7 4h10l3 16.5M10 4v11M14 4v11'), body(R(8.5, 15, 7, 2, 0.8))], { noAccent: true }),
    icon('slide', 'Slide', ['playground', 'kids', 'park', 'play', 'slide'], [line('M5 20.5V6M8.5 20.5V6M5 9.5h3.5M5 13h3.5M5 16.5h3.5'), body('M8.5 6h2c4 0 5 9 9.5 12.5v2h-2c-3.5-3.5-4-11-7.5-12H8.5Z')], { noAccent: true }),
    icon('seesaw', 'Seesaw', ['teeter totter', 'playground', 'balance', 'kids', 'park'], [body(rotateD(R(3, 10.5, 18, 2.2, 1), -15)), body(poly([[9, 20.5], [15, 20.5], [12, 14.5]], 0.8, true))], { noAccent: true }),
    icon('lawn-mower', 'Lawn Mower', ['mowing', 'grass', 'garden', 'yard', 'lawn'], [body(R(3.5, 11.5, 12, 5, 1.5)), body(C(6, 18, 2.2) + C(13, 18, 2.2), { cover: true }), line('M15.5 12 19.5 4.5h1.5')], { noAccent: true }),
  ],
};
