import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, L, C, poly, rotateD } from '../src/geo.mjs';

export default {
  category: 'home',
  icons: [
    icon('floor-lamp', 'Floor Lamp', ['lamp', 'standing lamp', 'light', 'living room', 'furniture'], [body(poly([[8, 3.5], [16, 3.5], [18, 9.5], [6, 9.5]], 0.8, true)), line(L(12, 9.5, 12, 20.5)), line('M8.5 20.5h7'), accent(L(15.5, 11.6, 15.5, 14))]),
    icon('armchair', 'Armchair', ['chair', 'seat', 'sofa', 'lounge', 'furniture'], [body(R(6, 4.5, 12, 14, 2.5)), body(R(3, 10, 4.5, 8.5, 2.2), { cover: true }), body(R(16.5, 10, 4.5, 8.5, 2.2), { cover: true }), line('M5 18.5v2M19 18.5v2'), accent(L(10.5, 14, 13.5, 14))]),
    icon('bookshelf', 'Bookshelf', ['bookcase', 'shelf', 'library', 'books', 'furniture'], [line('M4.5 3.5v17M19.5 3.5v17M4.5 12h15M4.5 20.5h15'), body(R(7, 5.5, 2.5, 6.5, 0.8)), body(R(10.5, 5.5, 2.5, 6.5, 0.8)), body(rotateD(R(14, 6, 2.5, 6, 0.8), 20, 16.5, 12)), body(R(7, 15, 5.5, 5.5, 0.8)), accent(C(15.8, 16.5, 1.2))]),
    icon('crib', 'Crib', ['cot', 'baby bed', 'nursery', 'infant', 'furniture'], [line('M4 4.5v16M20 4.5v16M4 7.5h16'), line('M8 7.5v6M12 7.5v6M16 7.5v6'), body(R(4, 13.5, 16, 4, 1))], { noAccent: true }),
  ],
};
