import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'media',
  icons: [
    icon('mic-gear', 'Microphone Settings', ['audio input', 'mic config', 'recording settings', 'voice', 'mic'], [body(R(6.5, 3, 6, 9, 3)), line('M4.5 9.5a5 5 0 0 0 10 0M9.5 14.5V17'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('mic-clock', 'Recording Time', ['recording length', 'timer', 'voice memo', 'voice', 'mic'], [body(R(6.5, 3, 6, 9, 3)), line('M4.5 9.5a5 5 0 0 0 10 0M9.5 14.5V17'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('mic-search', 'Voice Search', ['speak to search', 'voice query', 'assistant', 'voice', 'mic'], [body(R(6.5, 3, 6, 9, 3)), line('M4.5 9.5a5 5 0 0 0 10 0M9.5 14.5V17'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
  ],
};
