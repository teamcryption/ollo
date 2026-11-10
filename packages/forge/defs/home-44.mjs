import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'home',
  icons: [
    icon('fridge-chat', 'Fridge Chat', ['chat', 'support', 'message', 'fridge', 'fridge'], [body(R(5, 3.5, 9, 14, 1.5)), line('M5.2 8.5h8.6M7 5.5v1.5M7 10.5v2.5'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('washer-chat', 'Washer Chat', ['chat', 'support', 'message', 'washer', 'washer'], [body(R(4, 3.5, 11, 14, 1.5)), line('M4.2 6.5h10.6'), line(C(9.5, 11.5, 3)), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('oven-chat', 'Oven Chat', ['chat', 'support', 'message', 'oven', 'oven'], [body(R(4, 4, 11, 13, 1.5)), line(R(6, 8.5, 7, 6, 0.8)), line('M6.5 6.2h1M9 6.2h1'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('sofa-chat', 'Sofa Chat', ['chat', 'support', 'message', 'sofa', 'sofa'], [line('M5 9V7a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14 7v2'), body(R(3, 9, 13, 6, 1.5)), line('M4.5 15v2M14.5 15v2'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('water-chat', 'Water Chat', ['chat', 'support', 'message', 'water', 'water'], [body('M9.5 3.5c2.5 3 4.5 5.5 4.5 8.3a4.5 4.5 0 0 1-9 0c0-2.8 2-5.3 4.5-8.3Z'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('lamp-chat', 'Lamp Chat', ['chat', 'support', 'message', 'lamp', 'lamp'], [body('M6 3.5h7l2 6H4Z'), line('M9.5 9.7V17M6 17.5h7'), body('M14.4 12.8h5.3a1.3 1.3 0 0 1 1.3 1.3v3.6a1.3 1.3 0 0 1-1.3 1.3h-3.1l-2.1 1.7V19h-.1a1.3 1.3 0 0 1-1.3-1.3v-3.6a1.3 1.3 0 0 1 1.3-1.3Z', { cover: true })], { noAccent: true }),
    icon('fridge-download', 'Download Fridge', ['download', 'save', 'export', 'fridge', 'fridge'], [body(R(5, 3.5, 9, 14, 1.5)), line('M5.2 8.5h8.6M7 5.5v1.5M7 10.5v2.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('washer-download', 'Download Washer', ['download', 'save', 'export', 'washer', 'washer'], [body(R(4, 3.5, 11, 14, 1.5)), line('M4.2 6.5h10.6'), line(C(9.5, 11.5, 3)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('oven-download', 'Download Oven', ['download', 'save', 'export', 'oven', 'oven'], [body(R(4, 4, 11, 13, 1.5)), line(R(6, 8.5, 7, 6, 0.8)), line('M6.5 6.2h1M9 6.2h1'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('sofa-download', 'Download Sofa', ['download', 'save', 'export', 'sofa', 'sofa'], [line('M5 9V7a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14 7v2'), body(R(3, 9, 13, 6, 1.5)), line('M4.5 15v2M14.5 15v2'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('water-download', 'Download Water', ['download', 'save', 'export', 'water', 'water'], [body('M9.5 3.5c2.5 3 4.5 5.5 4.5 8.3a4.5 4.5 0 0 1-9 0c0-2.8 2-5.3 4.5-8.3Z'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('lamp-download', 'Download Lamp', ['download', 'save', 'export', 'lamp', 'lamp'], [body('M6 3.5h7l2 6H4Z'), line('M9.5 9.7V17M6 17.5h7'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.3 16.8l1.7 1.7 1.7-1.7')], { noAccent: true }),
    icon('sofa-cloud', 'Cloud Sofa', ['cloud', 'sync', 'online', 'sofa', 'sofa'], [line('M5 9V7a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14 7v2'), body(R(3, 9, 13, 6, 1.5)), line('M4.5 15v2M14.5 15v2'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('water-cloud', 'Cloud Water', ['cloud', 'sync', 'online', 'water', 'water'], [body('M9.5 3.5c2.5 3 4.5 5.5 4.5 8.3a4.5 4.5 0 0 1-9 0c0-2.8 2-5.3 4.5-8.3Z'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
    icon('lamp-cloud', 'Cloud Lamp', ['cloud', 'sync', 'online', 'lamp', 'lamp'], [body('M6 3.5h7l2 6H4Z'), line('M9.5 9.7V17M6 17.5h7'), body('M14.6 20.3a2.2 2.2 0 0 1-.2-4.4 2.5 2.5 0 0 1 4.6.4 2 2 0 0 1 0 4Z', { cover: true })], { noAccent: true }),
  ],
};
