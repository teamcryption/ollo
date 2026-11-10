import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'home',
  icons: [
    icon('faucet-download', 'Download Faucet', ['download', 'save', 'export', 'faucet', 'faucet'], [line('M7 7V4.5M5 4.5h4'), body('M3.5 7h7a4 4 0 0 1 4 4v1.5h-3V11a1 1 0 0 0-1-1h-7Z'), line(D(13, 15.5)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('broom-download', 'Download Broom', ['download', 'save', 'export', 'broom', 'broom'], [line('M15 3.5 10 9.6'), body('M8.2 8.7l3.5 2.8-2.2 6-6-4.6Z'), line('M6 14.4l1.6-2M8.2 16l1.6-2'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('iron-download', 'Download Iron', ['download', 'save', 'export', 'iron', 'iron'], [line('M8 9V6.5h6.5V9'), body('M3 15.5c0-3.6 2.5-6.5 6-6.5h5.5v6.5Z'), line(D(6.5, 12.5)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('door-pencil', 'Edit Door', ['edit', 'write', 'modify', 'door', 'door'], [body(R(5, 3.5, 9, 14.5, 1.5)), line(D(11.3, 11)), line('M3 18.5h3'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('bathtub-pencil', 'Edit Bathtub', ['edit', 'write', 'modify', 'bathtub', 'bathtub'], [line('M5 10.5V6a2 2 0 0 1 4 0'), body('M3 10.5h13v2.5a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z'), line('M5.5 17l-.8 1.5'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('lantern-pencil', 'Edit Lantern', ['edit', 'write', 'modify', 'lantern', 'lantern'], [line('M7.5 4.5a2 2 0 0 1 4 0'), body(R(6, 6.5, 7, 10, 2)), line('M5 6.5h9M5 16.5h9'), line('M9.5 9.5c1 1 1 2 0 3-1-1-1-2 0-3Z'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
