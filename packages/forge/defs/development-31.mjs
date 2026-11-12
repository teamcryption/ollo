import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'development',
  icons: [
    icon('laptop-upload', 'Upload Laptop', ['upload', 'send', 'export', 'laptop', 'laptop'], [body(R(5, 5, 12, 8.5, 1.5)), line('M3 16h10'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('branch-upload', 'Upload Branch', ['upload', 'send', 'export', 'branch', 'branch'], [line(C(5, 5, 1.8) + C(5, 15, 1.8) + C(13, 7, 1.8)), line('M5 6.8v6.4M13 8.8c0 3-3 3.2-6.5 4.8'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('terminal-upload', 'Upload Terminal', ['upload', 'send', 'export', 'terminal', 'terminal'], [body(R(3, 4, 13, 11, 1.5)), line('M5.5 8l2 1.5-2 1.5M9.5 12h3'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('bug-upload', 'Upload Bug', ['upload', 'send', 'export', 'bug', 'bug'], [body(E(9.5, 11, 3.5, 4.5)), line('M6 8 4 6.5M13 8l2-1.5M6 11H3.5M13 11h2.5M6.5 14l-2 1.5M12.5 14l2 1.5M9.5 6.5V15.5'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('network-upload', 'Upload Network', ['upload', 'send', 'export', 'network', 'network'], [line(C(9.5, 5, 1.8)), line(C(5, 15, 1.8)), line(C(14, 15, 1.8)), line('M9.5 6.8v3.7M5 13.2v-1.5h9v1.5'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('server-rack-upload', 'Upload Server Rack', ['upload', 'send', 'export', 'server rack', 'server-rack'], [body(R(4.5, 3, 10, 15.5, 1.5)), line('M4.7 7.5h9.6M4.7 11.5h9.6M4.7 15h9.6'), line(D(7, 5.3) + D(7, 9.5) + D(7, 13.3)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('circuit-upload', 'Upload Circuit', ['upload', 'send', 'export', 'circuit', 'circuit'], [line('M3 6h5l2 2v4l2 2h4M3 15h4M10 3v3M16 6h-3'), line(C(7.5, 15, 0.01)), body(C(8.5, 15, 1.3)), body(C(12, 6, 1.3)), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
