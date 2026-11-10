import { icon, body, line } from '../src/dsl.mjs';
import { R, C, D } from '../src/geo.mjs';

export default {
  category: 'design',
  icons: [
    icon('anchor-point', 'Anchor Point', ['vector node', 'bezier handle', 'path point', 'edit path', 'curve'], [line('M3.5 15.5C5.5 12.5 7.5 12 9.5 12M14.5 12c2 0 4-.5 6-3.5'), line('M5.6 18.4 9.5 14.5M14.5 9.5l3.9-3.9'), body(R(9.5, 9.5, 5, 5, 1.2)), body(C(4.6, 19.4, 1.5)), body(C(19.4, 4.6, 1.5))], { noAccent: true }),
    icon('gradient', 'Gradient', ['fade', 'halftone', 'colour blend', 'transition', 'fill'], [body(R(3.5, 3.5, 17, 17, 2.5)), line(D(7, 7) + D(7, 10.3) + D(7, 13.7) + D(7, 17) + D(10.3, 8.6) + D(10.3, 12) + D(10.3, 15.4) + D(13.7, 10.3) + D(13.7, 13.7) + D(17, 12))], { noAccent: true }),
    icon('fill-stroke', 'Fill and Stroke', ['fill', 'stroke', 'colour', 'outline', 'appearance'], [body(R(3.5, 3.5, 11, 11, 2.5)), body(R(9.5, 9.5, 11, 11, 2.5), { cover: true }), line(R(12.5, 12.5, 5, 5, 1))], { noAccent: true }),
    icon('spacing', 'Spacing', ['gap', 'padding', 'margin', 'distance', 'layout'], [body(R(3.5, 4, 3.5, 16, 1.2)), body(R(17, 4, 3.5, 16, 1.2)), line('M9 12h6M10.8 10.2 9 12l1.8 1.8M13.2 10.2 15 12l-1.8 1.8')], { noAccent: true }),
  ],
};
