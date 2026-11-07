import { R, C, L, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'travel',
  icons: [
    icon('airplane', 'Airplane', ['flight', 'plane', 'travel', 'airport', 'trip'], [body('M12 3c.8 0 1.5 1 1.5 2.5V9l6.5 4v2l-6.5-2v4l2 1.5V20l-3.5-1-3.5 1v-1.5l2-1.5v-4L4 15v-2l6.5-4V5.5C10.5 4 11.2 3 12 3Z')], { noAccent: true, anim: { preset: 'bounce', dist: -2 } }),
    icon('suitcase', 'Suitcase', ['luggage', 'baggage', 'trip', 'travel', 'vacation'], [body(R(5.5, 7, 13, 12.5, 2.5)), line('M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2'), line(L(9, 10.5, 9, 16)), accent(L(15, 10.5, 15, 16))], { badges: ['check'] }),
    icon('passport', 'Passport', ['travel document', 'id', 'visa', 'border', 'identity'], [body(R(5, 3, 14, 18, 2.5)), line(C(12, 10, 3.2)), accent(L(9.5, 16.5, 14.5, 16.5))]),
    icon('bed', 'Bed', ['hotel', 'sleep', 'room', 'stay', 'accommodation'], [line('M3.5 6v13.5'), line('M3.5 16.5H21v3'), body('M11 11h7.5a2.5 2.5 0 0 1 2.5 2.5v3H11Z'), accent(C(7.3, 12.3, 1.7))]),
    icon('tent', 'Tent', ['camping', 'outdoors', 'campsite', 'adventure'], [body(poly([[12, 4], [20.5, 19.5], [3.5, 19.5]], 1, true)), line('M12 13l-3 6.5'), line('M12 13l3 6.5')], { noAccent: true }),
    icon('ticket', 'Ticket', ['pass', 'admission', 'boarding', 'event', 'coupon'], [body('M3.5 7.5A1.5 1.5 0 0 1 5 6h14a1.5 1.5 0 0 1 1.5 1.5V10a2 2 0 0 0 0 4v2.5A1.5 1.5 0 0 1 19 18H5a1.5 1.5 0 0 1-1.5-1.5V14a2 2 0 0 0 0-4Z'), line(L(14.5, 8.5, 14.5, 9.5)), line(L(14.5, 11.5, 14.5, 12.5)), line(L(14.5, 14.5, 14.5, 15.5)), accent(L(7.5, 12, 11, 12))], { badges: ['check'] }),
    icon('binoculars', 'Binoculars', ['explore', 'search', 'view', 'sightseeing', 'watch'], [body(C(7, 15.5, 3.5)), body(C(17, 15.5, 3.5)), line('M4.5 13 6.5 6.5h3l.5 6.5'), line('M19.5 13l-2-6.5h-3l-.5 6.5'), line(L(10.5, 15, 13.5, 15))], { noAccent: true }),
  ],
};
