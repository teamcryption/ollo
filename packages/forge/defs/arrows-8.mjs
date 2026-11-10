import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'arrows',
  icons: [
    icon('arrow-dashed-right', 'Dashed Arrow Right', ['dashed', 'path', 'next', 'right', 'arrow'], [line('M3.5 12h3M9 12h3M14.5 12h5'), line(head(20, 12, 0, 4))], { dir: 'right', turns: { left: 180, up: -90, down: 90 } }),
    icon('arrow-from-dot-right', 'Arrow From Dot Right', ['start', 'origin', 'launch', 'right', 'arrow'], [body(C(5.5, 12, 2.5)), line('M8 12h11.5'), line(head(20, 12, 0, 4))], { dir: 'right', turns: { left: 180, up: -90, down: 90 } }),
    icon('arrows-double-right', 'Double Arrows Right', ['parallel', 'sync', 'both', 'right', 'arrows'], [line('M4 8.5h14.5M4 15.5h14.5'), line(head(19, 8.5, 0, 3.5)), line(head(19, 15.5, 0, 3.5))], { dir: 'right', turns: { left: 180, up: -90, down: 90 } }),
    icon('arrow-arc-right', 'Arc Arrow Right', ['arc', 'jump over', 'skip', 'right', 'arrow'], [line('M4.5 16.5C4.5 10 7.8 7 11.2 7s6.8 3 6.8 8.5'), line(head(18, 16.5, 90, 4))], { dir: 'right', turns: { left: 180, up: -90, down: 90 } }),
  ],
};
