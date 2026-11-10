import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D } from '../src/geo.mjs';

export default {
  category: 'fashion',
  icons: [
    icon('cap', 'Cap', ['baseball cap', 'hat', 'snapback', 'headwear', 'sport'], [body('M3.5 15a7 7 0 0 1 14 0Z'), body('M10.5 15h9a1.5 1.5 0 0 1 0 3h-9Z'), line('M10.5 8v7'), accent(D(10.5, 5.6))]),
    icon('beanie', 'Beanie', ['wool hat', 'knit cap', 'winter', 'toque', 'headwear'], [body(C(12, 5.3, 1.8)), body('M5.5 15.5V13a6.5 6.5 0 0 1 13 0v2.5Z'), body(R(4.5, 15.5, 15, 4.5, 1.5), { cover: true }), line('M8.5 16.5v2.5M12 16.5v2.5M15.5 16.5v2.5')], { noAccent: true }),
    icon('hoodie', 'Hoodie', ['sweatshirt', 'hooded top', 'clothing', 'casual', 'streetwear'], [body('M8 7a4 4 0 0 1 8 0l4 2.5-1.5 4-2-.5v7.5h-9V13l-2 .5L4 9.5Z'), line('M9.5 8a2.5 2.5 0 0 0 5 0'), line('M10.5 11v3M13.5 11v3')], { noAccent: true }),
    icon('skirt', 'Skirt', ['clothing', 'womenswear', 'pleated skirt', 'outfit', 'fashion'], [body([[8, 4.5], [16, 4.5], [19.5, 19.5], [4.5, 19.5]].map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('') + 'Z'), line('M8.2 7.5h7.6'), line('M10 7.5 8.5 19.5M14 7.5l1.5 12')], { noAccent: true }),
    icon('shorts', 'Shorts', ['trunks', 'clothing', 'summer', 'casual', 'pants'], [body('M5 4.5h14l1.5 15h-6.5L12 11l-2 8.5H3.5Z'), line('M5.3 7.5h13.4')], { noAccent: true }),
    icon('apron', 'Apron', ['cooking', 'chef', 'kitchen', 'bbq', 'baking'], [line('M9 7V5.5a3 3 0 0 1 6 0V7M5 11 3.5 13M19 11l1.5 2'), body('M8.5 7h7l1 3H19v10.5H5V10h2.5Z'), accent(R(9.5, 14, 5, 3, 1))]),
  ],
};
