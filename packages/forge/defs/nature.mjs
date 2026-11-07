import { R, C, L, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const wave = (y) => `M3 ${y}c1.5 0 1.5-1.5 3-1.5s1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5`;

export default {
  category: 'nature',
  icons: [
    icon('leaf', 'Leaf', ['eco', 'green', 'plant', 'nature', 'sustainable'], [body('M5 19C5 10 10 5 19.5 4.5 19 14 14 19 5 19Z'), line(L(5.5, 18.5, 13.5, 10.5))], { noAccent: true, anim: 'wiggle' }),
    icon('tree', 'Tree', ['forest', 'park', 'nature', 'outdoors', 'wood'], [body('M12 3.5a5.5 5.5 0 0 1 5.3 7A4.5 4.5 0 0 1 15 18H9a4.5 4.5 0 0 1-2.3-7.5A5.5 5.5 0 0 1 12 3.5Z'), line(L(12, 12.5, 12, 20.5))], { noAccent: true }),
    icon('tulip', 'Flower', ['tulip', 'bloom', 'garden', 'spring', 'plant'], [body('M7.5 5l2.5 2 2-3 2 3 2.5-2V9a4.5 4.5 0 0 1-9 0Z'), line(L(12, 13.5, 12, 20.5)), line('M12 18c-2.5 0-4.5-1.5-5-3.5 2.5 0 4.5 1 5 3.5Z')], { noAccent: true }),
    icon('potted-plant', 'Potted Plant', ['plant', 'houseplant', 'pot', 'garden', 'grow'], [body(poly([[7, 13.5], [17, 13.5], [15.8, 20], [8.2, 20]], 0.8, true)), line(L(12, 13.5, 12, 8.5)), line('M12 10c0-3-2-4.5-5-4.5 0 3 2 4.5 5 4.5Z'), line('M12 8.5c0-2.5 1.5-4.5 4.5-4.5 0 2.5-1.5 4.5-4.5 4.5Z')], { noAccent: true }),
    icon('waves', 'Waves', ['water', 'sea', 'ocean', 'surf', 'beach'], [line(wave(8)), accent(wave(12.5)), line(wave(17))], { anim: 'wiggle' }),
    icon('mushroom', 'Mushroom', ['fungi', 'forest', 'nature', 'foraging'], [body('M4 12a8 8 0 0 1 16 0Z'), line('M9.5 12v5.5a2.5 2.5 0 0 0 5 0V12'), line(D(14.5, 9)), accent(D(9, 8.5))]),
    icon('cactus', 'Cactus', ['desert', 'succulent', 'plant', 'dry'], [body('M10 20.5V6a2 2 0 0 1 4 0v14.5Z'), line('M10 13H8a2 2 0 0 1-2-2V9'), line('M14 11h2a2 2 0 0 0 2-2V7.5'), line(L(6.5, 20.5, 17.5, 20.5))], { noAccent: true }),
  ],
};
