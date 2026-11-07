import { R, C, L, A, poly, D, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'business',
  icons: [
    icon('vote', 'Vote', ['ballot', 'election', 'poll', 'survey', 'decision'], [line('M8.5 11V4.5A1 1 0 0 1 9.5 3.5h5a1 1 0 0 1 1 1V11'), body(R(3.5, 11, 17, 9.5, 2)), accent(poly([[10.8, 7.5], [11.8, 8.5], [13.4, 6.5]], 0.3))]),
    icon('strategy', 'Strategy', ['plan', 'tactics', 'playbook', 'game plan'], [line('M4 4l4 4m0-4-4 4'), line(D(8.5, 13)), line(D(10.5, 16)), line(D(13.5, 17.5)), accent(C(18, 18, 2.2)), line('M14 7.5a5 5 0 0 1 5 2.5'), line(poly([[19.8, 7.2], [19.2, 10.2], [16.3, 9.6]], 0.3))]),
    icon('meeting', 'Meeting', ['conference', 'team', 'table', 'boardroom', 'discussion'], [body(R(6, 9, 12, 6, 2)), line(C(9, 5, 1.6)), line(C(15, 5, 1.6)), line(C(9, 19, 1.6)), accent(C(15, 19, 1.6))]),
    icon('gavel', 'Gavel', ['law', 'judge', 'auction', 'legal', 'verdict'], [body(rotateD(R(10, 6, 8, 4, 1.2), 45, 14, 8)), line(L(12.4, 9.6, 5, 17)), accent(R(14, 16, 6, 2.5, 0.8)), line(L(12.5, 20.5, 21, 20.5))], { anim: 'wiggle' }),
  ],
};
