import { R, C, L, A, poly, D, E, mirrorD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const WING_UP = 'M12 11C10 6 6.5 3.5 4 4.5 3 7.5 5 11 12 11Z';
const WING_LO = 'M12 11c-5 0-7 2-6.5 5 2 1.5 4.5 0 6.5-5Z';

export default {
  category: 'animals',
  icons: [
    icon('dog', 'Dog', ['puppy', 'pet', 'canine', 'pup'], [body(poly([[7.5, 5], [3, 6.5], [3.5, 14.5], [6.5, 12]], 0.8, true)), body(poly([[16.5, 5], [21, 6.5], [20.5, 14.5], [17.5, 12]], 0.8, true)), body(R(6.5, 5, 11, 14.5, 5), { cover: true }), line(D(9.5, 10.5)), line(D(14.5, 10.5)), accent(poly([[11, 14.2], [13, 14.2], [12, 15.5]], 0.3, true))]),
    icon('butterfly', 'Butterfly', ['insect', 'moth', 'spring', 'transform', 'wings'], [body(WING_UP), body(WING_LO), body(mirrorD(WING_UP)), body(mirrorD(WING_LO)), line(L(12, 7.5, 12, 17)), line('M12 7.5 10.5 4.5'), line('M12 7.5l1.5-3')], { noAccent: true, anim: 'wiggle' }),
    icon('bee', 'Bee', ['honey', 'insect', 'pollinate', 'buzz', 'busy'], [line(C(8, 5.5, 2.5)), line(C(16, 5.5, 2.5)), body(R(7, 8, 10, 12.5, 5), { cover: true }), line(L(7.2, 12, 16.8, 12)), line(L(7.2, 15.5, 16.8, 15.5))], { noAccent: true, anim: 'wiggle' }),
    icon('rabbit', 'Rabbit', ['bunny', 'hare', 'easter', 'pet'], [body(R(8, 3, 3, 8.5, 1.5)), body(R(13, 3, 3, 8.5, 1.5)), body(C(12, 15, 6), { cover: true }), line(D(9.8, 14.3)), line(D(14.2, 14.3)), accent(D(12, 17.3))]),
    icon('turtle', 'Turtle', ['tortoise', 'slow', 'reptile', 'sea turtle'], [body('M3 15.5a7.5 7.5 0 0 1 15 0Z'), line(C(19.3, 13, 1.6)), line(L(5.5, 15.7, 5, 18)), line(L(15.5, 15.7, 16, 18)), accent(L(8, 12, 13, 12))], { anim: { preset: 'nudge', dir: [1, 0], dist: 1 } }),
    icon('snail', 'Snail', ['slow', 'slug', 'garden', 'shell'], [body(C(13, 11, 6)), line('M13 11a2 2 0 1 1 2 2'), line('M4 19h15'), line(L(4, 19, 4, 13.5)), line(L(4, 13.5, 3.5, 10.5)), line(L(4, 13.5, 6, 11))], { noAccent: true }),
    icon('whale', 'Whale', ['ocean', 'sea', 'marine', 'mammal'], [body('M3 12c0 4.5 3.5 7.5 8.5 7.5 5 0 7.5-3 8-6.5l1.5-3-3 .5C16 8.5 12 8 8 9.5 5 10.5 3 11 3 12Z'), line(D(7, 13)), accent('M8 6.5V4.5m0 0L6.5 3.5M8 4.5l1.5-1')], { anim: 'wiggle' }),
    icon('owl', 'Owl', ['wisdom', 'night', 'bird', 'learning', 'wise'], [body(R(5, 4, 14, 16.5, 6)), line(C(9.3, 9, 2.2)), line(C(14.7, 9, 2.2)), accent(poly([[11.3, 13.6], [12, 15.2], [12.7, 13.6]], 0.2, true))]),
  ],
};
