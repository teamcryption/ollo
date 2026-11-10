import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'development',
  icons: [
    icon('branch-pencil', 'Edit Branch', ['edit', 'write', 'modify', 'branch', 'branch'], [line(C(5, 5, 1.8) + C(5, 15, 1.8) + C(13, 7, 1.8)), line('M5 6.8v6.4M13 8.8c0 3-3 3.2-6.5 4.8'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('terminal-pencil', 'Edit Terminal', ['edit', 'write', 'modify', 'terminal', 'terminal'], [body(R(3, 4, 13, 11, 1.5)), line('M5.5 8l2 1.5-2 1.5M9.5 12h3'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('bug-pencil', 'Edit Bug', ['edit', 'write', 'modify', 'bug', 'bug'], [body(E(9.5, 11, 3.5, 4.5)), line('M6 8 4 6.5M13 8l2-1.5M6 11H3.5M13 11h2.5M6.5 14l-2 1.5M12.5 14l2 1.5M9.5 6.5V15.5'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('server-pencil', 'Edit Server', ['edit', 'write', 'modify', 'server', 'server'], [body(R(3.5, 4, 12, 5.5, 1.5)), body(R(3.5, 11.5, 12, 5.5, 1.5)), line(D(6.5, 6.8) + D(6.5, 14.3)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
