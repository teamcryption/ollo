import { R, C, L, A, poly, D, E, mirrorD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const DRAPE = 'M4.5 4.5h5c0 5-1 10-3 15.5h-2Z';

export default {
  category: 'home',
  icons: [
    icon('wardrobe', 'Wardrobe', ['closet', 'cupboard', 'furniture', 'clothes'], [body(R(4.5, 3, 15, 16.5, 1.5)), line(L(12, 3.2, 12, 19.3)), line(L(10, 9.5, 10, 12)), accent(L(14, 9.5, 14, 12)), line(L(6.5, 19.7, 6.5, 21)), line(L(17.5, 19.7, 17.5, 21))]),
    icon('chair', 'Chair', ['seat', 'furniture', 'dining chair', 'sit'], [line(L(7, 3.5, 7, 20.5)), body(R(7, 11.5, 10, 3, 1)), line(L(16, 14.7, 16, 20.5))], { noAccent: true }),
    icon('dining-table', 'Table', ['dining table', 'desk', 'furniture', 'kitchen'], [body(R(3, 8, 18, 3, 1)), line(L(5.5, 11.2, 5, 20)), line(L(18.5, 11.2, 19, 20))], { noAccent: true }),
    icon('curtains', 'Curtains', ['drapes', 'window', 'blinds', 'decor'], [line(L(3, 4, 21, 4)), body(DRAPE), body(mirrorD(DRAPE))], { noAccent: true }),
    icon('iron', 'Iron', ['ironing', 'laundry', 'clothes', 'press'], [line('M9 10.5V8a1.5 1.5 0 0 1 1.5-1.5h7.5A1.5 1.5 0 0 1 19.5 8v2.5'), body('M3.5 17.5a7 7 0 0 1 7-7h9v7Z'), accent(D(13, 14))]),
    icon('vacuum', 'Vacuum Cleaner', ['hoover', 'clean', 'housework', 'vacuum'], [line('M14 3.5h3M15.5 3.5 12.8 9'), body(R(9, 9, 5.5, 7.5, 2)), line(L(11, 16.7, 10, 17.2)), body(R(5, 17.2, 10, 3.3, 1.5))], { noAccent: true }),
    icon('fireplace', 'Fireplace', ['hearth', 'cosy', 'warm', 'chimney'], [body(R(3, 4, 18, 16.5, 1)), line(L(3.2, 8, 20.8, 8)), line('M7 20.5v-6a5 5 0 0 1 10 0v6'), accent('M12 14.5c1 1 1.5 1.8 1.5 2.6a1.5 1.5 0 0 1-3 0c0-.8.5-1.6 1.5-2.6Z')]),
    icon('mirror', 'Mirror', ['reflection', 'vanity', 'dresser', 'decor'], [body(E(12, 10, 6, 7)), line(L(12, 17.2, 12, 20.5)), line(L(8.5, 20.5, 15.5, 20.5)), accent(L(9.5, 9.5, 11.5, 7.5))]),
  ],
};
