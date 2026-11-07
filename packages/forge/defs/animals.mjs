import { R, C, L, E, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'animals',
  icons: [
    icon('paw', 'Paw', ['pet', 'dog', 'cat', 'animal', 'footprint'], [body('M8 17.5c0-2.5 1.8-4.5 4-4.5s4 2 4 4.5a2 2 0 0 1-2.5 2c-.6-.2-1-.3-1.5-.3s-.9.1-1.5.3A2 2 0 0 1 8 17.5Z'), body(E(5.8, 11.5, 1.7, 2.1)), body(E(9.5, 7, 1.7, 2.2)), body(E(14.5, 7, 1.7, 2.2)), body(E(18.2, 11.5, 1.7, 2.1))], { noAccent: true }),
    icon('fish', 'Fish', ['seafood', 'aquarium', 'sea', 'animal', 'fishing'], [body('M7 12c2-3.2 4.6-5 7.5-5 3.3 0 5.6 2.2 6.5 5-.9 2.8-3.2 5-6.5 5-2.9 0-5.5-1.8-7.5-5Z'), line(poly([[6.5, 12], [3.5, 8.5], [3.5, 15.5]], 0.5, true)), accent(D(17, 10.8))], { anim: 'wiggle' }),
    icon('cat', 'Cat', ['pet', 'kitten', 'animal', 'feline'], [body('M5 10.5V4l4.5 3.5h5L19 4v6.5c.3.8.5 1.5.5 2.5 0 4-3.4 7-7.5 7s-7.5-3-7.5-7c0-1 .2-1.7.5-2.5Z'), line(D(9.5, 12.5)), line(D(14.5, 12.5)), accent(D(12, 15.8))]),
    icon('bird', 'Bird', ['tweet', 'animal', 'wildlife', 'fly'], [body('M4 13c3 0 5-2 6-5a4 4 0 0 1 8 0v1l2.5 1.5L18 11.5c-.5 4.5-3.5 8-8 8-3 0-5.5-2.5-6-6.5Z'), accent(D(15, 7.5))], { anim: { preset: 'bounce', dist: -1.5 } }),
  ],
};
