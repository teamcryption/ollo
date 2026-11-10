import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'ai',
  icons: [
    icon('robot-gear', 'Bot Settings', ['automation settings', 'configure bot', 'ai assistant', 'robot', 'robot'], [line('M9.5 7V4.5'), body(R(4, 7, 11, 8, 2.5)), line(D(7.5, 11) + D(11.5, 11)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('robot-clock', 'Scheduled Automation', ['cron', 'automated task', 'bot schedule', 'robot', 'robot'], [line('M9.5 7V4.5'), body(R(4, 7, 11, 8, 2.5)), line(D(7.5, 11) + D(11.5, 11)), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('robot-shield', 'AI Safety', ['safe ai', 'guardrails', 'protected bot', 'robot', 'robot'], [line('M9.5 7V4.5'), body(R(4, 7, 11, 8, 2.5)), line(D(7.5, 11) + D(11.5, 11)), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
  ],
};
