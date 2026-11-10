import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, poly } from '../src/geo.mjs';

export default {
  category: 'food',
  icons: [
    icon('bagel', 'Bagel', ['bread', 'breakfast', 'bakery', 'sesame', 'brunch'], [body(E(12, 12.5, 8.5, 6.5)), line(E(12, 12, 2.8, 1.6)), line(D(7.5, 10) + D(16.5, 10) + D(8.5, 15.5) + D(15.5, 15.5) + D(12, 7.8))], { noAccent: true }),
    icon('bento', 'Bento Box', ['lunch box', 'japanese meal', 'meal prep', 'compartments', 'lunch'], [body(R(3, 5, 18, 14, 2.5)), line('M12 5.2v13.6M12.2 12h8.6'), line(C(7.5, 12, 2.2)), line('M14.5 8.5h3.5M14.5 15.5h3.5')], { noAccent: true }),
    icon('rice-bowl', 'Rice Bowl', ['rice', 'chopsticks', 'asian meal', 'donburi', 'dinner'], [body('M3.5 11h17c0 4.7-3.8 8.5-8.5 8.5S3.5 15.7 3.5 11Z'), line('M6.5 11c0-2.8 2.5-4.5 5.5-4.5s5.5 1.7 5.5 4.5'), line('M14 8 20 3.5M15.8 9.3l5-4.3')], { noAccent: true }),
    icon('milk-carton', 'Milk Carton', ['milk', 'dairy', 'juice carton', 'groceries', 'drink'], [body('M7 8.5 9 4h6l2 4.5V19a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19Z'), line('M7.2 8.5h9.6'), accent('M9.5 14h5')]),
    icon('moka-pot', 'Moka Pot', ['stovetop espresso', 'coffee maker', 'italian coffee', 'brew', 'percolator'], [body(poly([[7, 4], [17, 4], [15.5, 10.75], [8.5, 10.75]], 0.8, true)), body(poly([[8.5, 12.75], [15.5, 12.75], [17, 20.5], [7, 20.5]], 0.8, true)), line('M17 5.5h1.5A1.5 1.5 0 0 1 20 7v2.5'), line('M7 4.5 5 6')], { noAccent: true }),
  ],
};
