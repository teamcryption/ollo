import { R, C, L, A, poly, D, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const UNION = poly([[3.5, 3.5], [14.5, 3.5], [14.5, 9.5], [20.5, 9.5], [20.5, 20.5], [9.5, 20.5], [9.5, 14.5], [3.5, 14.5]], 1.5, true);
const SQ_A = R(3.5, 3.5, 11, 11, 2);
const SQ_B = R(9.5, 9.5, 11, 11, 2);
const handle = (x, y) => body(R(x - 1.5, y - 1.5, 3, 3, 0.6));
const BRACKETS = [
  poly([[3.5, 7], [3.5, 3.5], [7, 3.5]], 1),
  poly([[17, 3.5], [20.5, 3.5], [20.5, 7]], 1),
  poly([[20.5, 17], [20.5, 20.5], [17, 20.5]], 1),
  poly([[7, 20.5], [3.5, 20.5], [3.5, 17]], 1),
].map((d) => line(d));

export default {
  category: 'design',
  icons: [
    icon('union', 'Union', ['boolean', 'combine', 'merge shapes', 'unite'], [body(UNION)], { noAccent: true }),
    icon('subtract', 'Subtract', ['boolean', 'minus front', 'cut out', 'shape'], [body(poly([[3.5, 3.5], [14.5, 3.5], [14.5, 9.5], [9.5, 9.5], [9.5, 14.5], [3.5, 14.5]], 1.5, true)), line(SQ_B)], { noAccent: true }),
    icon('intersect', 'Intersect', ['boolean', 'overlap', 'common', 'shape'], [line(SQ_A), line(SQ_B), body(R(9.5, 9.5, 5, 5, 0.5))], { noAccent: true }),
    icon('exclude', 'Exclude', ['boolean', 'xor', 'difference', 'shape'], [body(UNION), line(R(9.5, 9.5, 5, 5, 0.5)), line(L(9.5, 9.5, 14.5, 14.5))], { noAccent: true }),
    icon('opacity', 'Opacity', ['transparency', 'alpha', 'fade', 'see-through'], [body(C(12, 12, 8.5)), line(L(12, 3.7, 12, 20.3)), line(D(15, 7)), line(D(17.5, 9.5)), line(D(15, 12)), line(D(17.5, 14.5)), line(D(15, 17))], { noAccent: true }),
    icon('shadow', 'Shadow', ['drop shadow', 'elevation', 'depth', 'effect'], [body(R(3.5, 3.5, 13, 13, 2.5)), line('M20 7v10.5a2.5 2.5 0 0 1-2.5 2.5H7')], { noAccent: true }),
    icon('center-object', 'Center Object', ['centre', 'align middle', 'position', 'snap to centre'], [body(R(3.5, 3.5, 17, 17, 3)), line(L(3.7, 12, 7.5, 12)), line(L(16.5, 12, 20.3, 12)), line(L(12, 3.7, 12, 7.5)), line(L(12, 16.5, 12, 20.3)), accent(C(12, 12, 2.5))]),
    icon('corner-radius', 'Corner Radius', ['radius', 'rounded corner', 'border radius', 'round'], [line('M4 20.5V12a8 8 0 0 1 8-8h8.5'), accent(D(12, 12))]),
    icon('selection', 'Selection', ['select', 'bounding box', 'marquee', 'transform', 'handles'], [handle(5, 5), handle(19, 5), handle(5, 19), handle(19, 19), line(L(8, 5, 16, 5)), line(L(8, 19, 16, 19)), line(L(5, 8, 5, 16)), line(L(19, 8, 19, 16)), accent(D(12, 12))]),
    icon('group-objects', 'Group', ['group', 'combine layers', 'objects', 'bundle'], [...BRACKETS, body(C(8.8, 9.3, 2.8)), accent(R(12.5, 12.5, 5, 5, 1))]),
  ],
};
