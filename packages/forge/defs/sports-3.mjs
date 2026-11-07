import { R, C, L, A, poly, D, E, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const r = (d) => rotateD(d, -40, 10, 9);

export default {
  category: 'sports',
  icons: [
    icon('tennis-racket', 'Tennis Racket', ['racquet', 'tennis', 'squash', 'padel'], [body(r(E(10, 9, 5, 6.3))), line(r(L(10, 3, 10, 15))), line(r(L(5.2, 9, 14.8, 9))), line(L(13.9, 13.8, 19.5, 20)), accent(C(19, 5, 1.5))]),
    icon('hockey-stick', 'Hockey', ['ice hockey', 'stick', 'puck', 'field hockey'], [line('M15 3.5 9 17.5a2 2 0 0 1-1.8 1.2H4.5'), accent(R(14, 17.5, 6, 3, 1.5))]),
    icon('ice-skate', 'Ice Skate', ['skating', 'winter sport', 'rink', 'figure skating'], [body('M6 4h5v6l6 2.5a2 2 0 0 1 1.5 2V17H6Z'), line('M5 19.5h12.5a2 2 0 0 0 2-2'), line(L(8, 17.2, 8, 19.5)), line(L(15, 17.2, 15, 19.5))], { noAccent: true }),
    icon('goal-net', 'Goal', ['goal', 'net', 'score', 'football', 'soccer'], [line('M3.5 19V6h17v13'), line(L(3.7, 10, 20.3, 10)), line(L(3.7, 14, 20.3, 14)), line(L(8, 6.2, 8, 19)), line(L(12, 6.2, 12, 19)), line(L(16, 6.2, 16, 19))], { noAccent: true }),
    icon('scoreboard', 'Scoreboard', ['score', 'match', 'points', 'results'], [body(R(3, 4, 18, 13, 2)), line(L(12, 4.2, 12, 16.8)), line(L(6, 10.5, 9, 10.5)), accent(L(15, 10.5, 18, 10.5)), line(L(8, 17.2, 8, 20.5)), line(L(16, 17.2, 16, 20.5))]),
    icon('basketball-hoop', 'Basketball Hoop', ['hoop', 'basket', 'net', 'court'], [body(R(4, 3, 16, 9, 1.5)), line(R(9, 6, 6, 4, 0.5)), line(L(8, 13.5, 16, 13.5)), line(poly([[8.5, 13.5], [10, 20], [14, 20], [15.5, 13.5]], 0.3))], { noAccent: true }),
  ],
};
