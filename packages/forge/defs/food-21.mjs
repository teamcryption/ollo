import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, poly } from '../src/geo.mjs';

export default {
  category: 'food',
  icons: [
    icon('onigiri', 'Onigiri', ['rice ball', 'japanese', 'nori', 'bento', 'snack'], [body(poly([[12, 4], [20.5, 19], [3.5, 19]], 3.5, true)), body(R(9, 13.5, 6, 5.5, 0.5), { cover: true })], { noAccent: true }),
    icon('sundae', 'Sundae', ['ice cream', 'dessert', 'cherry on top', 'parlour', 'sweet'], [body('M6 13a3 3 0 0 1 3-3 3 3 0 0 1 6 0 3 3 0 0 1 3 3Z'), body('M5 13h14l-3 4.5H8Z'), line('M12 17.5v3M9 20.5h6'), accent(C(12, 4, 1))]),
    icon('bubble-tea', 'Bubble Tea', ['boba', 'milk tea', 'tapioca', 'drink', 'taiwan'], [line('M13 7l2.5-4'), line('M5 7h14'), body(poly([[6, 7], [18, 7], [16.5, 20.5], [7.5, 20.5]], 1, true)), accent(D(10, 17) + D(12, 18) + D(14, 17))]),
    icon('coffee-to-go', 'Coffee To Go', ['takeaway coffee', 'paper cup', 'latte', 'cafe', 'coffee'], [body(R(6, 4, 12, 2.5, 1)), body(poly([[6.5, 6.5], [17.5, 6.5], [16, 20.5], [8, 20.5]], 1, true)), line('M7 11h10M7.5 15.5h9')], { noAccent: true }),
    icon('wine-barrel', 'Barrel', ['wine barrel', 'cask', 'winery', 'keg', 'cellar'], [body('M6 3.5h12c1.5 3 2 5.5 2 8.5s-.5 5.5-2 8.5H6c-1.5-3-2-5.5-2-8.5s.5-5.5 2-8.5Z'), line('M4.6 8h14.8M4.6 16h14.8')], { noAccent: true }),
    icon('cookie-jar', 'Cookie Jar', ['cookies', 'biscuit jar', 'snack', 'kitchen', 'treat'], [body(C(12, 4, 1.3)), body(R(6, 5.5, 12, 2.5, 1)), body(R(5, 8, 14, 12.5, 3)), accent(C(12, 14, 2.5))]),
  ],
};
