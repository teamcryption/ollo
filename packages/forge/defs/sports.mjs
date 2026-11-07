import { R, C, L, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'sports',
  icons: [
    icon('basketball', 'Basketball', ['ball', 'nba', 'hoops', 'sport'], [body(C(12, 12, 8.5)), line(L(3.7, 12, 20.3, 12)), line(L(12, 3.7, 12, 20.3)), line('M6 5.8a10 10 0 0 1 0 12.4'), line('M18 5.8a10 10 0 0 0 0 12.4')], { noAccent: true, anim: { preset: 'bounce', dist: -2 } }),
    icon('baseball', 'Baseball', ['ball', 'softball', 'sport', 'game'], [body(C(12, 12, 8.5)), line('M6.5 5.8a8.5 8.5 0 0 1 0 12.4'), line('M17.5 5.8a8.5 8.5 0 0 0 0 12.4')], { noAccent: true, anim: 'spin' }),
    icon('dumbbell', 'Dumbbell', ['gym', 'weights', 'fitness', 'workout', 'strength'], [line(L(7.5, 12, 16.5, 12)), body(R(5, 7, 2.5, 10, 1)), body(R(16.5, 7, 2.5, 10, 1)), line(L(3.2, 9.5, 3.2, 14.5)), line(L(20.8, 9.5, 20.8, 14.5))], { noAccent: true, anim: { preset: 'bounce', dist: -1.5 } }),
    icon('kettlebell', 'Kettlebell', ['gym', 'weights', 'training', 'fitness'], [body('M6.5 15a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-1.5 4.5H8A5.5 5.5 0 0 1 6.5 15Z'), line('M8.5 10.5V7a3.5 3.5 0 0 1 7 0v3.5')], { noAccent: true }),
    icon('whistle', 'Whistle', ['referee', 'coach', 'signal', 'sport'], [body('M4 12.5a4.5 4.5 0 1 0 9 0V11h7.5V8H8.5A4.5 4.5 0 0 0 4 12.5Z'), accent(C(8.5, 12.5, 1.3))], { anim: 'wiggle' }),
    icon('golf', 'Golf', ['flag', 'hole', 'course', 'sport', 'putt'], [line(L(8, 3.5, 8, 18)), body(poly([[8, 3.5], [16, 6.5], [8, 9.5]], 0.6, true)), line('M3.5 19.5c2.5-1 5-1.5 8.5-1.5s6 .5 8.5 1.5'), accent(C(16.5, 14.5, 1.2))]),
  ],
};
