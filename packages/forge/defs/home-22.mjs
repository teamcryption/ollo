import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly } from '../src/geo.mjs';

export default {
  category: 'home',
  icons: [
    icon('bunk-bed', 'Bunk Bed', ['beds', 'kids room', 'dorm', 'hostel', 'sleep'], [line('M4.5 3.5v17M19.5 3.5v17'), body(R(4.5, 7, 15, 3, 1) + R(4.5, 15, 15, 3, 1)), line('M15 10v5M17.5 10v5M15 12.5h2.5')], { noAccent: true }),
    icon('dresser', 'Dresser', ['chest of drawers', 'bedroom', 'drawers', 'furniture', 'storage'], [body(R(4, 5, 16, 13, 1.5)), line('M4.2 9.5h15.6M4.2 13.5h15.6M6 18v2.5M18 18v2.5'), line(D(12, 7.3) + D(12, 11.5) + D(12, 15.7))], { noAccent: true }),
    icon('air-purifier', 'Air Purifier', ['air filter', 'clean air', 'allergy', 'hepa', 'purifier'], [body(R(6, 3, 12, 18, 2.5)), line(C(12, 8, 2.5)), line('M9 13.5h6M9 16h6M9 18.5h6')], { noAccent: true }),
    icon('range-hood', 'Range Hood', ['extractor fan', 'cooker hood', 'kitchen', 'vent', 'exhaust'], [body(R(9.5, 3, 5, 6, 0.6)), body(poly([[8, 9], [16, 9], [20, 15], [4, 15]], 1, true)), accent('M9 18v1.5M15 18v1.5')]),
    icon('rice-cooker', 'Rice Cooker', ['rice', 'steamer', 'kitchen appliance', 'cooker', 'asian'], [line('M10.5 5.5h3'), body('M5 10.5a7 4.5 0 0 1 14 0Z'), body('M4.5 11h15v6.5a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3Z'), accent(L(10.5, 15.5, 13.5, 15.5))]),
    icon('air-fryer', 'Air Fryer', ['fryer', 'kitchen appliance', 'healthy cooking', 'oven', 'crispy'], [body(R(5, 3, 14, 17.5, 4)), line(R(7, 11, 10, 7, 1.5)), accent('M10 6.5h4')]),
    icon('juicer', 'Citrus Juicer', ['juicer', 'squeezer', 'lemon', 'orange juice', 'kitchen'], [line('M12 6v4.5'), body('M7 11a5 5 0 0 1 10 0Z'), body('M3.5 12h17c0 4.5-3.8 8-8.5 8s-8.5-3.5-8.5-8Z', { cover: true })], { noAccent: true }),
    icon('hand-mixer', 'Hand Mixer', ['whisk', 'baking', 'electric mixer', 'beater', 'kitchen'], [body('M5 4.5h11a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3H8Z'), line('M9.5 11.5v5M13 11.5v5'), line(E(9.5, 18.3, 1.2, 2) + E(13, 18.3, 1.2, 2))], { noAccent: true }),
    icon('water-filter', 'Water Filter', ['filter jug', 'pitcher', 'purified water', 'drinking water', 'kitchen'], [line('M6 5 4.5 3.5M16.5 8h1.5a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1.5'), body('M6 5h10l1 15.5H7Z'), line('M6.4 10h9.9')], { noAccent: true }),
    icon('bar-stool', 'Bar Stool', ['stool', 'counter seat', 'kitchen island', 'pub', 'seat'], [body(R(6.5, 3.5, 11, 3, 1.5)), line('M8.5 6.5 7 20.5M15.5 6.5 17 20.5M8 14.5h8')], { noAccent: true }),
    icon('nightstand', 'Nightstand', ['bedside table', 'night table', 'bedroom', 'lamp', 'furniture'], [body(poly([[8, 3], [12, 3], [13.5, 6], [6.5, 6]], 0.6, true)), line('M10 6v2.5'), body(R(5, 8.5, 14, 10, 1.5)), line('M5.2 13.3h13.6M7 18.5v2M17 18.5v2'), line(D(12, 10.9) + D(12, 15.9))], { noAccent: true }),
    icon('cradle', 'Cradle', ['baby bed', 'bassinet', 'nursery', 'infant', 'rocking'], [body('M4 12V8a5 5 0 0 1 5-5h1v6h10v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z'), line('M8 17 7.5 19M16 17l.5 2M3.5 18.5q8.5 3 17 0')], { noAccent: true }),
    icon('paper-towel', 'Paper Towel', ['kitchen roll', 'towel roll', 'cleaning', 'wipe', 'tissue'], [body(R(3.5, 4, 17, 6.5, 3.25)), line(E(6.8, 7.25, 1.1, 1.6)), body('M11 10.5h9v10l-1.5-1.2-1.5 1.2-1.5-1.2-1.5 1.2-1.5-1.2-1.5 1.2Z', { cover: true })], { noAccent: true }),
    icon('oven-mitt', 'Oven Mitt', ['oven glove', 'baking', 'hot', 'kitchen', 'pot holder'], [body('M8 20.5v-8.3L5.7 9.9a1.6 1.6 0 0 1 2.3-2.3l1 1V7.5a4 4 0 0 1 8 0v13Z'), line('M8.2 17h8.6')], { noAccent: true }),
    icon('sieve', 'Sieve', ['strainer', 'sifter', 'flour', 'baking', 'kitchen'], [body('M3.5 9.5h11a5.5 5.5 0 0 1-11 0Z'), line('M14.5 9.5h6'), accent(D(7.5, 18.5) + D(10.5, 18.5) + D(9, 20.5))]),
  ],
};
