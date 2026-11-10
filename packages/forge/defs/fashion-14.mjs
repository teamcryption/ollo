import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly } from '../src/geo.mjs';

export default {
  category: 'fashion',
  icons: [
    icon('scarf', 'Scarf', ['muffler', 'winter', 'knitwear', 'neck', 'accessory'], [body(R(5.5, 3.5, 13, 4.5, 2.25)), body('M9 8h4.5l-.5 10H8.5Z', { cover: true }), body('M13.5 8H16l1.5 9-3.2.6Z', { cover: true }), line('M9 18.3v2.2M11 18.3v2.2M15 18v2.2M17 17.6v2.2')], { noAccent: true }),
    icon('high-heel', 'High Heel', ['stiletto', 'pump', 'shoe', 'heels', 'footwear'], [body('M4 7.5h2.5c1.5 3.5 3.5 6 6.5 7l5.5 1a2 2 0 0 1 2 2V19H13c-3 0-5.5-2-7.2-5.2L5.6 20.5H4.2Z')], { noAccent: true }),
    icon('belt', 'Belt', ['buckle', 'waist', 'leather', 'accessory', 'trousers'], [body(R(3, 9.5, 18, 5, 1)), body(R(13, 7.5, 5.5, 9, 1.5), { cover: true }), line('M13 12h3.5'), accent(D(6.5, 12) + D(9, 12))]),
    icon('earring', 'Earring', ['jewelry', 'drop earring', 'gem', 'accessory', 'pendant'], [body(C(12, 5, 1.6)), line('M12 6.6v3'), body(poly([[12, 9.6], [15.2, 13.6], [12, 20.5], [8.8, 13.6]], 0.8, true)), line('M8.8 13.6h6.4')], { noAccent: true }),
    icon('nail-polish', 'Nail Polish', ['manicure', 'varnish', 'beauty', 'nails', 'cosmetics'], [body(R(10, 3, 4, 7, 1)), body(R(6.5, 10, 11, 10.5, 3)), accent(L(9.5, 13.5, 9.5, 17))]),
    icon('vest', 'Vest', ['waistcoat', 'gilet', 'sleeveless', 'clothing', 'formal'], [body('M8.5 3.5 12 12l3.5-8.5c0 3.5 1.5 5.5 3.5 6.5v10.5H5V10c2-1 3.5-3 3.5-6.5Z'), line('M12 12v8.5')], { noAccent: true }),
    icon('swimsuit', 'Swimsuit', ['bathing suit', 'swimwear', 'beach', 'summer', 'one piece'], [line('M8.5 3.5v4M15.5 3.5v4'), body('M8.5 7.5c1.5 1.8 5.5 1.8 7 0 .5 3-1 5 0 7l1.5 3.5c-2 .5-3.5 1.3-5 2.5-1.5-1.2-3-2-5-2.5L8.5 14.5c1-2-.5-4 0-7Z')], { noAccent: true }),
  ],
};
