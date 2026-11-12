import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'logistics',
  icons: [
    icon('package-flag', 'Report Package', ['report', 'flag', 'mark', 'package', 'package'], [body(R(3.5, 5, 12, 12, 2)), line('M9.5 5.2v3.5'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('crate-flag', 'Report Crate', ['report', 'flag', 'mark', 'crate', 'crate'], [body(R(3.5, 5, 12, 12, 1)), line('M3.7 5.2l11.6 11.6M3.7 16.8 15.3 5.2'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('conveyor-flag', 'Report Conveyor', ['report', 'flag', 'mark', 'conveyor', 'conveyor'], [body(R(3, 11, 13, 4, 2)), line(D(5, 13) + D(9.5, 13) + D(14, 13)), body(R(6, 5, 7, 5, 0.8)), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
  ],
};
