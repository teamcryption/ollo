import { R, C, L, A, poly, D, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'education',
  icons: [
    icon('graduation-cap', 'Graduation Cap', ['graduate', 'school', 'degree', 'university', 'education'], [body(poly([[12, 4.5], [20.5, 9], [12, 13.5], [3.5, 9]], 0.8, true)), line('M6.5 11v4.5c0 1.5 2.5 3.5 5.5 3.5s5.5-2 5.5-3.5V11'), line(L(19.5, 10, 19.5, 14.5))], { noAccent: true, anim: { preset: 'bounce', dist: -1.5 } }),
    icon('notebook', 'Notebook', ['notes', 'journal', 'diary', 'study', 'write'], [body(R(5.5, 3.5, 13, 17, 2.5)), line(L(4, 7.5, 7, 7.5)), line(L(4, 12, 7, 12)), line(L(4, 16.5, 7, 16.5)), accent(L(10, 8, 15, 8))], { badges: ['add', 'check'] }),
    icon('backpack', 'Backpack', ['school', 'bag', 'student', 'travel', 'rucksack'], [body('M6 11a6 6 0 0 1 12 0v7.5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2Z'), line('M10 5.4V5a2 2 0 0 1 4 0v.4'), line('M9 20.5V16a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4.5'), accent(L(10.5, 11.5, 13.5, 11.5))]),
    icon('exam', 'Exam', ['test', 'grade', 'score', 'quiz', 'assessment'], [body(R(4.5, 3, 15, 18, 2.5)), line('M8 13.5l2-6 2 6'), line(L(8.6, 11.8, 11.4, 11.8)), accent('M14 10.5h3M15.5 9v3'), line(L(8, 17, 16, 17))], { badges: ['check'] }),
    icon('books', 'Books', ['library', 'reading', 'study', 'shelf', 'literature'], [body(R(3, 4, 3.3, 16.5, 1)), line(L(3.2, 8, 6.1, 8)), body(R(8.5, 4, 3.3, 16.5, 1)), line(L(8.7, 16, 11.6, 16)), body(rotateD(R(14.5, 5, 3.3, 15.5, 1), 12, 14.5, 20.5))], { noAccent: true }),
    icon('drafting-compass', 'Drafting Compass', ['geometry', 'compass', 'drawing', 'maths', 'math'], [body(C(12, 4.8, 1.8)), line(L(11.2, 6.6, 6, 20)), line(L(12.8, 6.6, 18, 20)), line('M7.4 15.6a9 9 0 0 0 9.2 0')], { noAccent: true }),
    icon('video-lesson', 'Video Lesson', ['course', 'e-learning', 'webinar', 'online class', 'tutorial'], [body(R(3, 4, 18, 12, 2.5)), line(L(12, 16.2, 12, 19.5)), line(L(8.5, 20, 15.5, 20)), accent(poly([[10.5, 8], [14, 10], [10.5, 12]], 0.4, true))]),
  ],
};
