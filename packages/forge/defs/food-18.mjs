import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, poly } from '../src/geo.mjs';

export default {
  category: 'food',
  icons: [
    icon('colander', 'Colander', ['strainer', 'pasta', 'drain', 'kitchen', 'cooking'], [line('M3 9.5h18'), body('M4.5 9.5h15c0 4.5-3.2 8-7.5 8s-7.5-3.5-7.5-8Z'), line('M9.5 17.2v3.3h5v-3.3'), accent(D(9, 12.5) + D(12, 13.5) + D(15, 12.5))]),
    icon('saucepan', 'Saucepan', ['pan', 'pot', 'cooking', 'boil', 'kitchen'], [body(R(3.5, 10, 11, 9, 2)), line('M3 10h12M14.5 12.5h6'), accent('M7 4v3M11 4v3')]),
    icon('cooking-pot', 'Cooking Pot', ['stockpot', 'soup', 'stew', 'kitchen', 'boil'], [body(R(10.5, 4.5, 3, 2.5, 1)), line('M3.5 9h17M3 12h1.5M19.5 12H21'), body(R(4.5, 9, 15, 11, 2))], { noAccent: true }),
    icon('corkscrew', 'Corkscrew', ['wine opener', 'cork', 'bottle', 'wine', 'bar'], [body(R(4.5, 3.5, 15, 3, 1.5)), line('M12 6.5v3c-1.8 0-1.8 2 0 2s1.8 2 0 2-1.8 2 0 2 1.8 2 0 2v2.5')], { noAccent: true }),
    icon('measuring-cup', 'Measuring Cup', ['measure', 'baking', 'jug', 'recipe', 'kitchen'], [body('M5 7h11l-1 12a1.5 1.5 0 0 1-1.5 1.5h-6A1.5 1.5 0 0 1 6 19Z'), line('M5 7 3.5 5M15.8 9.5h2.7a2 2 0 0 1 2 2v1.5a2 2 0 0 1-2 2h-3.2'), accent('M8.5 11h3M8.5 14h3M8.5 17h3')]),
    icon('pizza-cutter', 'Pizza Cutter', ['pizza wheel', 'slicer', 'kitchen', 'cutter', 'pizza'], [body(C(9, 15, 5.5)), line('M12.9 11.1 15 9'), body(poly([[14, 8.5], [18.5, 4], [20.5, 6], [16, 10.5]], 1, true)), accent(D(9, 15))]),
  ],
};
