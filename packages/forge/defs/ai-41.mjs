import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'ai',
  icons: [
    icon('brain-circuit-bulb', 'Brain Circuit Ideas', ['idea', 'tip', 'insight', 'brain circuit', 'brain-circuit'], [body('M9.5 4.5a2.8 2.8 0 0 0-4.6 1.4A2.8 2.8 0 0 0 3.5 10.5a2.8 2.8 0 0 0 1.6 4.4 2.8 2.8 0 0 0 4.4 1.6Z'), line('M11 7.5h3l1.5-1.5M11 10.5h5M11 13.5h3l1.5 1.5'), line(C(16.5, 5.5, 0.01) + C(16.5, 15.5, 0.01)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('chip-ai-bulb', 'Chip Ai Ideas', ['idea', 'tip', 'insight', 'chip ai', 'chip-ai'], [body(R(5, 5, 9, 9, 1.5)), line('M7.5 11.5l1-4 1 4M7.8 10.3h1.4M11.5 7.5v4'), line('M7.5 3v2M11.5 3v2M7.5 14v2.5M11.5 14v2.5M3 8h2M3 11.5h2M14 8h2M14 11.5h2'), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
    icon('magic-sparkles-bulb', 'Magic Sparkles Ideas', ['idea', 'tip', 'insight', 'magic sparkles', 'magic-sparkles'], [body(star(8.5, 11, 5.5, 1.8, 4, 0.4)), body(star(14.5, 5, 2.5, 0.9, 4, 0.2)), body('M17 12.3a3.4 3.4 0 0 1 2 6.1v.8h-4v-.8a3.4 3.4 0 0 1 2-6.1Z', { cover: true }), line('M15.6 20.7h2.8')], { noAccent: true }),
  ],
};
