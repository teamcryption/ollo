import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'food',
  icons: [
    icon('no-gluten', 'Gluten Free', ['gluten free', 'wheat', 'celiac', 'allergen', 'diet', 'prohibited', 'sign'], [line('M12 17V8M12 10.5c-1.5 0-2.5-1-2.5-2.5 1.5 0 2.5 1 2.5 2.5Zm0 0c1.5 0 2.5-1 2.5-2.5-1.5 0-2.5 1-2.5 2.5Zm0 3c-1.5 0-2.5-1-2.5-2.5 1.5 0 2.5 1 2.5 2.5Zm0 0c1.5 0 2.5-1 2.5-2.5-1.5 0-2.5 1-2.5 2.5Z'), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
    icon('no-dairy', 'Dairy Free', ['lactose free', 'milk', 'vegan', 'allergen', 'diet', 'prohibited', 'sign'], [body('M10 7h4v1.5l1.5 2v6.5h-7v-6.5L10 8.5Z'), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
    icon('no-fish', 'No Fish', ['fish free', 'seafood allergy', 'vegetarian', 'allergen', 'diet', 'prohibited', 'sign'], [body('M7 12c1.5-2 3.3-3 5.2-3 2.6 0 4.3 2 4.3 3s-1.7 3-4.3 3C10.3 15 8.5 14 7 12Z'), line('M7 12 5.5 10.5M7 12l-1.5 1.5'), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
    icon('no-caffeine', 'Caffeine Free', ['decaf', 'no coffee', 'caffeine', 'diet', 'sleep', 'prohibited', 'sign'], [body('M8 9h7v4a3.5 3.5 0 0 1-7 0Z'), line('M15 10h1a1.5 1.5 0 0 1 0 3h-1'), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
