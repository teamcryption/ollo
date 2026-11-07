import { R, C, L, A, poly, D, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'education',
  icons: [
    icon('math', 'Maths', ['math', 'arithmetic', 'operators', 'calculate'], [line('M7.5 4.5v6M4.5 7.5h6'), line(L(13.5, 7.5, 19.5, 7.5)), line('M5 14.5l5 5M10 14.5l-5 5'), accent('M13.5 15.5h6M13.5 18.5h6')]),
    icon('crayon', 'Crayon', ['colouring', 'kids', 'draw', 'art'], [body(rotateD(poly([[9.5, 8], [12, 3], [14.5, 8], [14.5, 20.5], [9.5, 20.5]], 0.6, true), 35, 12, 12)), line(rotateD(L(9.7, 11, 14.3, 11), 35, 12, 12)), line(rotateD(L(9.7, 17.5, 14.3, 17.5), 35, 12, 12))], { noAccent: true }),
    icon('grade', 'Grade', ['a plus', 'score', 'mark', 'result', 'exam'], [line(poly([[4, 18], [9, 5], [14, 18]], 0.4)), line(L(5.9, 13, 12.1, 13)), accent('M18 8v6M15 11h6')]),
  ],
};
