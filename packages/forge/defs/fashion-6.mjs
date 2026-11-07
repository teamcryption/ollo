import { R, L, poly, translateD } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'fashion',
  icons: [
    icon('top-hat', 'Top Hat', ['hat', 'formal', 'magician', 'gentleman', 'tuxedo'], [body(R(7, 4.5, 10, 12.5, 1)), body(R(3.5, 17, 17, 2.5, 1.2), { cover: true }), line(L(7.2, 12, 16.8, 12))], { noAccent: true }),
    icon('necklace', 'Necklace', ['pendant', 'jewellery', 'chain', 'accessory', 'locket'], [line('M5 3.5c0 7 3 10.5 7 11.5 4-1 7-4.5 7-11.5'), body(poly([[12, 16.3], [14, 18.4], [12, 20.5], [10, 18.4]], 0.4, true))], { noAccent: true }),
    icon('mitten', 'Mitten', ['glove', 'winter', 'warm', 'knit', 'cold weather'], [body(translateD('M7.5 20.5V11a4 4 0 0 1 8 0v1.3l1.7-1.6a1.6 1.6 0 0 1 2.2 2.3l-3.9 3.8v3.7Z', -1.5, 0)), line(L(6.2, 17.5, 13.8, 17.5))], { noAccent: true }),
  ],
};
