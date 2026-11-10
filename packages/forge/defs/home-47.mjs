import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'home',
  icons: [
    icon('door-chat', 'Door Chat', ['chat', 'support', 'message', 'door', 'door'], [body(R(5, 3.5, 9, 14.5, 1.5)), line(D(11.3, 11)), line('M3 18.5h3'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('bathtub-chat', 'Bathtub Chat', ['chat', 'support', 'message', 'bathtub', 'bathtub'], [line('M5 10.5V6a2 2 0 0 1 4 0'), body('M3 10.5h13v2.5a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z'), line('M5.5 17l-.8 1.5'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('lantern-chat', 'Lantern Chat', ['chat', 'support', 'message', 'lantern', 'lantern'], [line('M7.5 4.5a2 2 0 0 1 4 0'), body(R(6, 6.5, 7, 10, 2)), line('M5 6.5h9M5 16.5h9'), line('M9.5 9.5c1 1 1 2 0 3-1-1-1-2 0-3Z'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('door-download', 'Download Door', ['download', 'save', 'export', 'door', 'door'], [body(R(5, 3.5, 9, 14.5, 1.5)), line(D(11.3, 11)), line('M3 18.5h3'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('bathtub-download', 'Download Bathtub', ['download', 'save', 'export', 'bathtub', 'bathtub'], [line('M5 10.5V6a2 2 0 0 1 4 0'), body('M3 10.5h13v2.5a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z'), line('M5.5 17l-.8 1.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('lantern-download', 'Download Lantern', ['download', 'save', 'export', 'lantern', 'lantern'], [line('M7.5 4.5a2 2 0 0 1 4 0'), body(R(6, 6.5, 7, 10, 2)), line('M5 6.5h9M5 16.5h9'), line('M9.5 9.5c1 1 1 2 0 3-1-1-1-2 0-3Z'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('fridge-pencil', 'Edit Fridge', ['edit', 'write', 'modify', 'fridge', 'fridge'], [body(R(5, 3.5, 9, 14, 1.5)), line('M5.2 8.5h8.6M7 5.5v1.5M7 10.5v2.5'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('washer-pencil', 'Edit Washer', ['edit', 'write', 'modify', 'washer', 'washer'], [body(R(4, 3.5, 11, 14, 1.5)), line('M4.2 6.5h10.6'), line(C(9.5, 11.5, 3)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('oven-pencil', 'Edit Oven', ['edit', 'write', 'modify', 'oven', 'oven'], [body(R(4, 4, 11, 13, 1.5)), line(R(6, 8.5, 7, 6, 0.8)), line('M6.5 6.2h1M9 6.2h1'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('sofa-pencil', 'Edit Sofa', ['edit', 'write', 'modify', 'sofa', 'sofa'], [line('M5 9V7a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14 7v2'), body(R(3, 9, 13, 6, 1.5)), line('M4.5 15v2M14.5 15v2'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('water-pencil', 'Edit Water', ['edit', 'write', 'modify', 'water', 'water'], [body('M9.5 3.5c2.5 3 4.5 5.5 4.5 8.3a4.5 4.5 0 0 1-9 0c0-2.8 2-5.3 4.5-8.3Z'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('lamp-pencil', 'Edit Lamp', ['edit', 'write', 'modify', 'lamp', 'lamp'], [body('M6 3.5h7l2 6H4Z'), line('M9.5 9.7V17M6 17.5h7'), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
    icon('candle-pencil', 'Edit Candle', ['edit', 'write', 'modify', 'candle', 'candle'], [line('M9.5 3.5c-1 1.2-1 2.2 0 3 1-.8 1-1.8 0-3Z'), body(R(6.5, 8, 6, 10, 1.2)), body('M13.5 20.7l.6-2.6 4.5-4.5a1.3 1.3 0 0 1 1.9 1.9l-4.5 4.5Z', { cover: true })], { noAccent: true }),
  ],
};
