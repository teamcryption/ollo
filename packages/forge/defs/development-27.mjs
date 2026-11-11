import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'development',
  icons: [
    icon('laptop-sparkle', 'AI Laptop', ['ai', 'smart', 'magic', 'laptop', 'laptop'], [body(R(5, 5, 12, 8.5, 1.5)), line('M3 16h10'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('code-sparkle', 'AI Code', ['ai', 'smart', 'magic', 'code', 'code'], [body(R(3, 4, 12, 15, 2)), line('M7.2 9 5.5 11l1.7 2M10.8 9l1.7 2-1.7 2'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('branch-sparkle', 'AI Branch', ['ai', 'smart', 'magic', 'branch', 'branch'], [line(C(5, 5, 1.8) + C(5, 15, 1.8) + C(13, 7, 1.8)), line('M5 6.8v6.4M13 8.8c0 3-3 3.2-6.5 4.8'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('terminal-sparkle', 'AI Terminal', ['ai', 'smart', 'magic', 'terminal', 'terminal'], [body(R(3, 4, 13, 11, 1.5)), line('M5.5 8l2 1.5-2 1.5M9.5 12h3'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('bug-sparkle', 'AI Bug', ['ai', 'smart', 'magic', 'bug', 'bug'], [body(E(9.5, 11, 3.5, 4.5)), line('M6 8 4 6.5M13 8l2-1.5M6 11H3.5M13 11h2.5M6.5 14l-2 1.5M12.5 14l2 1.5M9.5 6.5V15.5'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('server-sparkle', 'AI Server', ['ai', 'smart', 'magic', 'server', 'server'], [body(R(3.5, 4, 12, 5.5, 1.5)), body(R(3.5, 11.5, 12, 5.5, 1.5)), line(D(6.5, 6.8) + D(6.5, 14.3)), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('database-sparkle', 'AI Database', ['ai', 'smart', 'magic', 'database', 'database'], [body(E(9.5, 5.5, 5.5, 2)), line('M4 5.5v10c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-10M4 10.5c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
    icon('network-sparkle', 'AI Network', ['ai', 'smart', 'magic', 'network', 'network'], [line(C(9.5, 5, 1.8)), line(C(5, 15, 1.8)), line(C(14, 15, 1.8)), line('M9.5 6.8v3.7M5 13.2v-1.5h9v1.5'), body(star(17, 16.5, 4.6, 1.5, 4, 0.4), { cover: true })], { noAccent: true }),
  ],
};
