import { R, C, L, E, poly } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'animals',
  icons: [
    icon('birdhouse', 'Birdhouse', ['nest box', 'bird', 'garden', 'feeder', 'wildlife'], [line(L(12, 18, 12, 20.5)), body(R(6, 9, 12, 9, 1)), line('M4 10.5 12 4l8 6.5'), accent(C(12, 13, 1.7))]),
    icon('fishbowl', 'Fishbowl', ['aquarium', 'goldfish', 'pet', 'fish tank', 'water'], [body('M8.5 4.5h7v2.2a7.3 7.3 0 1 1-7 0Z'), line('M5.3 11h13.4'), accent(E(13, 15.3, 2.3, 1.5) + poly([[10.9, 15.3], [9, 14], [9, 16.6]], 0.3, true))]),
  ],
};
