import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'business',
  icons: [
    icon('kanban-pause', 'Pause Kanban', ['pause', 'hold', 'stop', 'kanban', 'kanban'], [body(R(3, 3.5, 13, 14, 1.5)), line('M7.5 3.7v13.6M11.5 3.7v13.6'), line('M4.8 6.5h1M4.8 9h1M9 6.5h1.2M13 6.5h1M13 9h1M13 11.5h1'), body(R(13.5, 13, 2.8, 7.5, 1), { cover: true }), body(R(17.7, 13, 2.8, 7.5, 1), { cover: true })], { noAccent: true }),
    icon('briefcase-leaf', 'Eco Briefcase', ['eco', 'green', 'sustainable', 'briefcase', 'briefcase'], [line('M7 7.5V6a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 12 6v1.5'), body(R(3, 7.5, 13, 10, 2)), line('M3.2 11.5h12.6'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('lightbulb-leaf', 'Eco Lightbulb', ['eco', 'green', 'sustainable', 'lightbulb', 'lightbulb'], [body('M7 13.5v-1c0-.8-.4-1.4-1-2a4.6 4.6 0 1 1 6.5 0c-.6.6-1 1.2-1 2v1Z'), line('M7.3 16h3.9'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('clipboard-leaf', 'Eco Clipboard', ['eco', 'green', 'sustainable', 'clipboard', 'clipboard'], [body(R(4, 4.5, 10, 13, 2)), body(R(6.5, 3, 5, 2.5, 1), { cover: true }), line('M6.5 9h5M6.5 12h3'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('megaphone-leaf', 'Eco Megaphone', ['eco', 'green', 'sustainable', 'megaphone', 'megaphone'], [body('M3 8.5h3l7.5-4v12L6 12.5H3Z'), line('M5 12.5l1 3.5'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('scale-leaf', 'Eco Justice Scale', ['eco', 'green', 'sustainable', 'justice scale', 'scale'], [line('M9.5 3.5v14M6 17.8h7M5 6h9'), line('M5 6.2l-2 4.2M5 6.2l2 4.2M14 6.2l-2 4.2M14 6.2l2 4.2'), body('M2.8 10.6h4.4a2.2 2.2 0 0 1-4.4 0Z'), body('M11.8 10.6h4.4a2.2 2.2 0 0 1-4.4 0Z'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('gavel-leaf', 'Eco Gavel', ['eco', 'green', 'sustainable', 'gavel', 'gavel'], [body(rotateD(R(7.5, 3, 7, 4, 1), 45, 11, 5)), line('M9.3 7.2 3.8 12.7'), body(R(3, 15.5, 8, 2.5, 0.8)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('presentation-leaf', 'Eco Presentation', ['eco', 'green', 'sustainable', 'presentation', 'presentation'], [body(R(3, 3.5, 13, 9, 1.2)), line('M9.5 12.5V15M6.5 18l3-3 3 3'), line('M6 9.5l2.5-2.5 2 2L13 6.5'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('id-badge-leaf', 'Eco ID Badge', ['eco', 'green', 'sustainable', 'id badge', 'id-badge'], [line('M8 3.5h3v2.5H8Z'), body(R(5, 5, 9, 13, 1.5)), line(C(9.5, 10, 1.6)), line('M7 15c.5-1.3 1.3-2 2.5-2s2 .7 2.5 2'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
  ],
};
