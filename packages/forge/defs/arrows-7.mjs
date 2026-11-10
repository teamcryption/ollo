import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'arrows',
  icons: [
    icon('arrow-zigzag-right', 'Zigzag Arrow Right', ['zigzag', 'erratic', 'path', 'right', 'arrow'], [line('M3.5 12 6 8l3 8 3-8 2.5 4H20'), line(head(20.5, 12, 0, 4))], { dir: 'right', turns: { left: 180, up: -90, down: 90 } }),
    icon('arrow-wave-right', 'Wave Arrow Right', ['wave', 'flow', 'wavy', 'right', 'arrow'], [line('M3.5 12c1.5-3 3-3 4.5 0s3 3 4.5 0 3-3 4.5 0H20'), line(head(20.5, 12, 0, 4))], { dir: 'right', turns: { left: 180, up: -90, down: 90 } }),
    icon('arrow-step-right', 'Step Arrow Right', ['step', 'stairs', 'level up', 'right', 'arrow'], [line('M3.5 16h6.5V8H20'), line(head(20.5, 8, 0, 4))], { dir: 'right', turns: { left: 180, up: -90, down: 90 } }),
  ],
};
