import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const spokes = Array.from({ length: 6 }, (_, i) => {
  const a = (i * Math.PI) / 3;
  return line(L(12, 12, 12 + 5.8 * Math.cos(a), 12 + 5.8 * Math.sin(a)));
});

export default {
  category: 'food',
  icons: [
    icon('fries', 'Fries', ['french fries', 'chips', 'fast food', 'snack'], [line(L(8, 10, 7.5, 4.5)), line(L(10.5, 10, 10.5, 3.5)), line(L(13.5, 10, 13.5, 4)), line(L(16, 10, 16.5, 5)), body('M6 10h12l-1.5 10.5h-9Z'), accent(L(10, 14.5, 14, 14.5))]),
    icon('popcorn', 'Popcorn', ['cinema', 'movie snack', 'film', 'snack'], [line('M6 10a2.5 2.5 0 0 1 3.3-3.2 2.8 2.8 0 0 1 5.4 0A2.5 2.5 0 0 1 18 10'), body('M5.5 10h13l-2 10.5h-9Z'), line(L(10, 10.2, 10.5, 20.3)), line(L(14, 10.2, 13.5, 20.3))], { noAccent: true }),
    icon('citrus', 'Citrus', ['lemon', 'orange', 'lime', 'fruit', 'slice'], [body(C(12, 12, 8.5)), line(C(12, 12, 6.3)), ...spokes], { noAccent: true }),
    icon('banana', 'Banana', ['fruit', 'potassium', 'tropical', 'snack'], [line(L(5, 6, 4.5, 4)), body('M5 6c-.5 7 3 12 10 13 2 .3 4-.3 5-1.5-6 0-10.5-4.5-11-11.5Z')], { noAccent: true }),
    icon('watermelon', 'Watermelon', ['melon', 'summer', 'fruit', 'slice'], [body('M3.5 9a8.5 8.5 0 0 0 17 0Z'), line('M5.8 9a6.2 6.2 0 0 0 12.4 0'), line(D(9, 11)), accent(D(12, 12)), line(D(15, 11))]),
    icon('strawberry', 'Strawberry', ['berry', 'fruit', 'sweet', 'summer'], [line('M8.5 7.5 12 5l3.5 2.5M12 5V3'), body('M12 7.5c4 0 7 2.5 7 5.5 0 4.5-4 8-7 8s-7-3.5-7-8c0-3 3-5.5 7-5.5Z'), line(D(9.8, 12)), line(D(14.2, 12)), accent(D(12, 15.8))]),
    icon('cocktail', 'Cocktail', ['drink', 'martini', 'bar', 'happy hour'], [body(poly([[4.5, 4.5], [19.5, 4.5], [12, 12]], 0.6, true)), line(L(7, 7, 17, 7)), line(L(12, 12, 12, 19.5)), line(L(8.5, 20, 15.5, 20))], { noAccent: true }),
    icon('milk', 'Milk', ['dairy', 'carton', 'drink', 'breakfast'], [line(R(9, 3, 6, 2, 0.5)), body('M7 8.5 9 5h6l2 3.5v12H7Z'), line(L(7.2, 8.5, 16.8, 8.5)), accent('M12 12s1.5 1.6 1.5 2.6a1.5 1.5 0 0 1-3 0c0-1 1.5-2.6 1.5-2.6Z')]),
  ],
};
