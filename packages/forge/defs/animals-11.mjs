import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, L, C, poly } from '../src/geo.mjs';

export default {
  category: 'animals',
  icons: [
    icon('doghouse', 'Doghouse', ['kennel', 'dog', 'pet', 'shelter', 'yard'], [body(poly([[5, 11], [12, 4.5], [19, 11], [19, 20.5], [5, 20.5]], 0.8, true)), line('M3.5 12.3 12 4.5l8.5 7.8'), line('M10 20.5V17a2 2 0 0 1 4 0v3.5'), accent(L(10.3, 11.7, 13.7, 11.7) + C(10, 11, 0.65) + C(10, 12.4, 0.65) + C(14, 11, 0.65) + C(14, 12.4, 0.65))]),
    icon('birdcage', 'Birdcage', ['cage', 'bird', 'pet', 'parrot', 'canary'], [line('M8.7 5.3V18.5M12 4v14.5M15.3 5.3V18.5'), line('M5 18.5V11a7 7 0 0 1 14 0v7.5'), body(R(4, 18, 16, 2.5, 1.2))], { noAccent: true }),
  ],
};
