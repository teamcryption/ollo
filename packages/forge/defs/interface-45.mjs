import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'interface',
  icons: [
    icon('idcard-pencil', 'Edit ID Card', ['edit', 'write', 'modify', 'id card', 'idcard'], [body(R(4, 3.5, 11, 14, 2)), line(C(9.5, 8.5, 2)), line('M6.5 14a3 3 0 0 1 6 0'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('firstaid-pencil', 'Edit First Aid', ['edit', 'write', 'modify', 'first aid', 'firstaid'], [line('M7.5 6V4.5h4V6'), body(R(3.5, 6, 12, 10, 2)), line('M9.5 8.8v4.4M7.3 11h4.4'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('hourglass-pencil', 'Edit Timer', ['edit', 'write', 'modify', 'timer', 'hourglass'], [line('M5.5 3.5h8M5.5 17.5h8'), body('M6.5 3.7h6v2.3l-3 4.5 3 4.5v2.3h-6V15l3-4.5-3-4.5Z'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
