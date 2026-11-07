import { R, C, L, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'fashion',
  icons: [
    icon('t-shirt', 'T-Shirt', ['shirt', 'clothing', 'apparel', 'top', 'merch'], [body('M8.5 4 4 6.5l1.5 4L7.5 10v10h9V10l2 .5 1.5-4L15.5 4a3.5 3.5 0 0 1-7 0Z')], { noAccent: true }),
    icon('hanger', 'Hanger', ['wardrobe', 'clothes', 'closet', 'laundry'], [line('M12 7.5V7a1.8 1.8 0 1 0-1.8-1.8'), line('M12 7.5 3.5 14a1.5 1.5 0 0 0 .9 2.7h15.2a1.5 1.5 0 0 0 .9-2.7Z')], { noAccent: true }),
    icon('glasses', 'Glasses', ['eyewear', 'spectacles', 'vision', 'read'], [line(C(7, 14, 3.5)), line(C(17, 14, 3.5)), line('M10.5 13.5a2 2 0 0 1 3 0'), line(L(3.5, 13, 5, 7)), line(L(20.5, 13, 19, 7))], { noAccent: true }),
    icon('diamond', 'Diamond', ['gem', 'jewel', 'premium', 'luxury', 'value'], [body(poly([[7, 4.5], [17, 4.5], [20.5, 9.5], [12, 20], [3.5, 9.5]], 0.8, true)), line(L(3.8, 9.5, 20.2, 9.5)), line('M9 9.5 12 19.5 15 9.5')], { noAccent: true }),
    icon('sneaker', 'Sneaker', ['shoe', 'trainers', 'footwear', 'running'], [body('M3.5 16V8.5H8c.5 2 2 3 3.5 3 1.5 0 3 1 4.5 2l3.5 1a2 2 0 0 1 1 1.5v1Z'), body(R(3.5, 17, 17, 2.5, 1))], { noAccent: true }),
  ],
};
