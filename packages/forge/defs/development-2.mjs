import { R, C, L, A, poly, D, rotateD, arcArrow } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'development',
  icons: [
    icon('git-commit', 'Commit', ['git', 'commit', 'save', 'version', 'change'], [line(L(3, 12, 8.3, 12)), body(C(12, 12, 3.5)), line(L(15.7, 12, 21, 12))], { noAccent: true }),
    icon('git-fork', 'Fork', ['git', 'fork', 'copy repo', 'split'], [body(C(7, 5.5, 2.2)), body(C(17, 5.5, 2.2)), body(C(12, 18.5, 2.2)), line('M7 7.7V9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7.7'), line(L(12, 11, 12, 16.3))], { noAccent: true }),
    icon('git-compare', 'Compare', ['diff', 'git', 'changes', 'versions', 'compare'], [body(C(6.5, 5.5, 2.2)), body(C(17.5, 18.5, 2.2)), line('M6.5 7.7V15a2 2 0 0 0 2 2h4'), line(poly([[11, 15], [13, 17], [11, 19]], 0.5)), line('M17.5 16.3V9a2 2 0 0 0-2-2h-4'), line(poly([[13, 5], [11, 7], [13, 9]], 0.5))], { noAccent: true }),
    icon('function', 'Function', ['formula', 'fx', 'math', 'method', 'lambda'], [line('M15 4.5h-1.5A2.5 2.5 0 0 0 11 7v10a2.5 2.5 0 0 1-2.5 2.5H7'), line(L(7.5, 10, 14, 10)), line(L(15.5, 13.5, 19.5, 17.5)), line(L(19.5, 13.5, 15.5, 17.5))], { noAccent: true }),
    icon('brackets', 'Brackets', ['array', 'list', 'square brackets', 'code', 'index'], [line(poly([[8.5, 4], [5.5, 4], [5.5, 20], [8.5, 20]], 0.6)), line(poly([[15.5, 4], [18.5, 4], [18.5, 20], [15.5, 20]], 0.6)), accent(L(10.5, 12, 13.5, 12))]),
    icon('regex', 'Regex', ['regular expression', 'pattern', 'match', 'search', 'wildcard'], [line(L(15, 4, 15, 12)), line(rotateD(L(15, 4, 15, 12), 60, 15, 8)), line(rotateD(L(15, 4, 15, 12), 120, 15, 8)), accent(R(5, 15, 4, 4, 1))]),
    icon('binary', 'Binary', ['bits', 'data', 'zeros and ones', 'code', 'machine'], [line(R(5.5, 4, 4.5, 7, 2.25)), line(poly([[14.5, 5.3], [16.5, 4], [16.5, 11]], 0.4)), line(poly([[5.5, 14.3], [7.5, 13], [7.5, 20]], 0.4)), accent(R(14, 13, 4.5, 7, 2.25))]),
    icon('pipeline', 'Pipeline', ['ci', 'cd', 'build', 'workflow', 'stages'], [body(C(5.5, 12, 2.3)), line(L(7.8, 12, 9.7, 12)), body(C(12, 12, 2.3)), line(L(14.3, 12, 16.2, 12)), body(C(18.5, 12, 2.3))], { noAccent: true }),
    icon('step-over', 'Step Over', ['debug', 'next line', 'skip', 'debugger'], [...arcArrow(12, 13, 6.5, 200, 340, 3).map((d) => line(d)), accent(D(12, 18.5))]),
  ],
};
