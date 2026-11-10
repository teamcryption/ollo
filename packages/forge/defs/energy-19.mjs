import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'energy',
  icons: [
    icon('plug-chat', 'Power Plug Chat', ['chat', 'support', 'message', 'power plug', 'plug'], [line('M7 3.5v3M12 3.5v3'), body(R(5, 6.5, 9, 5, 1.5)), line('M9.5 11.5V14a2 2 0 0 0 2 2'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('ev-chat', 'EV Charger Chat', ['chat', 'support', 'message', 'ev charger', 'ev'], [body(R(4, 4, 8, 13, 1.5)), line('M12 9h1.5l1.5 2v4'), line('M8.5 7l-1.5 3h2.5L8 13'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('plug-download', 'Download Power Plug', ['download', 'save', 'export', 'power plug', 'plug'], [line('M7 3.5v3M12 3.5v3'), body(R(5, 6.5, 9, 5, 1.5)), line('M9.5 11.5V14a2 2 0 0 0 2 2'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('ev-download', 'Download EV Charger', ['download', 'save', 'export', 'ev charger', 'ev'], [body(R(4, 4, 8, 13, 1.5)), line('M12 9h1.5l1.5 2v4'), line('M8.5 7l-1.5 3h2.5L8 13'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('plug-pencil', 'Edit Power Plug', ['edit', 'write', 'modify', 'power plug', 'plug'], [line('M7 3.5v3M12 3.5v3'), body(R(5, 6.5, 9, 5, 1.5)), line('M9.5 11.5V14a2 2 0 0 0 2 2'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
