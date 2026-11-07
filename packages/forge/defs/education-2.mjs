import { R, C, L, A, poly, D, E, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'education',
  icons: [
    icon('chalkboard', 'Chalkboard', ['blackboard', 'class', 'lesson', 'teach', 'whiteboard'], [body(R(3, 3.5, 18, 12.5, 1.5)), line(L(7, 16.2, 5.5, 20.5)), line(L(17, 16.2, 18.5, 20.5)), line(L(7, 7.5, 12, 7.5)), accent('M7 11.3c1.2-1.2 2.3-1.2 3.5 0s2.3 1.2 3.5 0')]),
    icon('abacus', 'Abacus', ['counting', 'maths', 'arithmetic', 'beads', 'calculate'], [line(R(3.5, 3.5, 17, 17, 2.5)), line(L(3.7, 8, 20.3, 8)), line(L(3.7, 12, 20.3, 12)), line(L(3.7, 16, 20.3, 16)), body(C(7.5, 8, 1.3)), body(C(10.6, 8, 1.3)), body(C(16.5, 12, 1.3)), body(C(7.5, 16, 1.3)), body(C(13.4, 16, 1.3)), body(C(16.5, 16, 1.3))], { noAccent: true }),
    icon('microscope', 'Microscope', ['lab', 'biology', 'research', 'science', 'magnify'], [body(rotateD(R(8.5, 3, 4, 10, 1.2), -30, 10.5, 8)), line('M14.5 20.5a5.5 5.5 0 0 0-2-9.3'), line(L(5, 20.5, 19, 20.5)), accent(L(6, 16.5, 10, 16.5))]),
    icon('letter-block', 'Letter Block', ['alphabet', 'abc', 'spelling', 'kids', 'learn'], [body(R(4, 4, 16, 16, 3)), line(poly([[8.5, 16], [12, 8], [15.5, 16]], 0.4)), line(L(9.8, 13, 14.2, 13))], { noAccent: true }),
    icon('teacher', 'Teacher', ['lecturer', 'tutor', 'instructor', 'class', 'lesson'], [line(R(9, 3.5, 12, 9, 1.5)), body(C(6, 11.5, 2)), body('M3 20.5V18a3 3 0 0 1 6 0v2.5'), accent(L(13, 7, 17, 7))]),
    icon('desk-globe', 'Desk Globe', ['geography', 'world', 'earth', 'atlas', 'school'], [body(C(12, 9.5, 6)), line(E(12, 9.5, 2.5, 5.8)), line(A(12, 9.5, 8.2, 30, 150)), line(L(12, 17.7, 12, 20.5)), line(L(8.5, 20.5, 15.5, 20.5))], { noAccent: true, anim: 'wiggle' }),
  ],
};
