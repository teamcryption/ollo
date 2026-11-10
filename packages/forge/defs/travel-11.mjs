import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C } from '../src/geo.mjs';

export default {
  category: 'travel',
  icons: [
    icon('beach-ball', 'Beach Ball', ['ball', 'summer', 'pool', 'beach', 'play'], [body(C(12, 12, 8.5)), line('M12 3.5c-3.5 2.5-4.5 6-3.5 9.5M12 3.5c3.5 2.5 4.5 6 3.5 9.5M3.6 13c3 2.5 13.8 2.5 16.8 0')], { noAccent: true }),
    icon('sun-lounger', 'Sun Lounger', ['deck chair', 'sunbed', 'pool', 'relax', 'beach'], [body('M3.5 13.5h11.5l3.5-6 1.8 1-4.1 7H3.5Z'), line('M5 15.5v4.5M15.5 15.5v4.5')], { noAccent: true }),
    icon('picnic-basket', 'Picnic Basket', ['hamper', 'picnic', 'outdoor', 'lunch', 'park'], [line('M7 10a5 5 0 0 1 10 0'), line('M3.5 10h17'), body(R(4.5, 10, 15, 10.5, 2)), line('M4.7 15h14.6M9.5 10.2v10M14.5 10.2v10')], { noAccent: true }),
    icon('bbq-grill', 'BBQ Grill', ['barbecue', 'grill', 'cookout', 'kettle grill', 'outdoor cooking'], [line('M3 9.5h18'), body('M4 9.5h16a8 6 0 0 1-16 0Z'), line('M8 15 6 20.5M16 15l2 5.5M12 15.5v5'), accent('M9 3.5c-1 1 1 2 0 3.5M14 3.5c-1 1 1 2 0 3.5')]),
    icon('hot-tub', 'Hot Tub', ['jacuzzi', 'spa', 'whirlpool', 'relax', 'resort'], [body(R(3.5, 11, 17, 9, 2)), line('M3.7 14h16.6'), accent('M8 4.5c-1 1.2 1 2.3 0 3.8M12 4.5c-1 1.2 1 2.3 0 3.8M16 4.5c-1 1.2 1 2.3 0 3.8')]),
    icon('pool-ladder', 'Pool Ladder', ['swimming pool', 'swim', 'pool', 'ladder', 'hotel'], [line('M7 17.5V7.5a2.5 2.5 0 0 1 5 0M13 17.5V7.5a2.5 2.5 0 0 1 5 0M7 11h6M7 14.5h6'), accent('M3.5 20.5c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 3.5.5')]),
  ],
};
