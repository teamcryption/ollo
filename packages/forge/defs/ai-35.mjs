import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'ai',
  icons: [
    icon('robot-hourglass', 'Robot Timer', ['timer', 'waiting', 'countdown', 'robot', 'robot'], [line('M9.5 7V4.5'), body(R(4, 7, 11, 8, 2.5)), line(D(7.5, 11) + D(11.5, 11)), body(poly([[13.5, 12.5], [20.5, 12.5], [17.6, 16.5], [20.5, 20.5], [13.5, 20.5], [16.4, 16.5]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('robot-arm-hourglass', 'Robot Arm Timer', ['timer', 'waiting', 'countdown', 'robot arm', 'robot-arm'], [body(R(4, 15.5, 7, 2.5, 0.6)), line('M7.5 15.3V11l5-4.5'), body(C(7.5, 11, 1.4)), body(C(12.5, 6.5, 1.4)), line('M13.8 5.5 15.5 3.5M13.8 7.3l2.2.5'), body(poly([[13.5, 12.5], [20.5, 12.5], [17.6, 16.5], [20.5, 20.5], [13.5, 20.5], [16.4, 16.5]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('brain-circuit-hourglass', 'Brain Circuit Timer', ['timer', 'waiting', 'countdown', 'brain circuit', 'brain-circuit'], [body('M9.5 4.5a2.8 2.8 0 0 0-4.6 1.4A2.8 2.8 0 0 0 3.5 10.5a2.8 2.8 0 0 0 1.6 4.4 2.8 2.8 0 0 0 4.4 1.6Z'), line('M11 7.5h3l1.5-1.5M11 10.5h5M11 13.5h3l1.5 1.5'), line(C(16.5, 5.5, 0.01) + C(16.5, 15.5, 0.01)), body(poly([[13.5, 12.5], [20.5, 12.5], [17.6, 16.5], [20.5, 20.5], [13.5, 20.5], [16.4, 16.5]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('neural-net-hourglass', 'Neural Net Timer', ['timer', 'waiting', 'countdown', 'neural net', 'neural-net'], [line(C(4, 6, 1.4) + C(4, 15, 1.4) + C(9.5, 10.5, 1.4) + C(15, 6, 1.4) + C(15, 15, 1.4)), line('M5.3 6.6l2.9 3.2M5.3 14.4l2.9-3.2M10.8 9.8l2.9-3.2M10.8 11.2l2.9 3.2'), body(poly([[13.5, 12.5], [20.5, 12.5], [17.6, 16.5], [20.5, 20.5], [13.5, 20.5], [16.4, 16.5]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('chip-ai-hourglass', 'Chip Ai Timer', ['timer', 'waiting', 'countdown', 'chip ai', 'chip-ai'], [body(R(5, 5, 9, 9, 1.5)), line('M7.5 11.5l1-4 1 4M7.8 10.3h1.4M11.5 7.5v4'), line('M7.5 3v2M11.5 3v2M7.5 14v2.5M11.5 14v2.5M3 8h2M3 11.5h2M14 8h2M14 11.5h2'), body(poly([[13.5, 12.5], [20.5, 12.5], [17.6, 16.5], [20.5, 20.5], [13.5, 20.5], [16.4, 16.5]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('magic-sparkles-hourglass', 'Magic Sparkles Timer', ['timer', 'waiting', 'countdown', 'magic sparkles', 'magic-sparkles'], [body(star(8.5, 11, 5.5, 1.8, 4, 0.4)), body(star(14.5, 5, 2.5, 0.9, 4, 0.2)), body(poly([[13.5, 12.5], [20.5, 12.5], [17.6, 16.5], [20.5, 20.5], [13.5, 20.5], [16.4, 16.5]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('voice-assistant-hourglass', 'Voice Assistant Timer', ['timer', 'waiting', 'countdown', 'voice assistant', 'voice-assistant'], [body(C(9.5, 10.5, 6.5)), line('M6.5 10.5v0M8 9v3M9.5 7.5v6M11 9v3M12.5 10.5v0'), body(poly([[13.5, 12.5], [20.5, 12.5], [17.6, 16.5], [20.5, 20.5], [13.5, 20.5], [16.4, 16.5]], 0.6, true), { cover: true })], { noAccent: true }),
    icon('robot-trophy', 'Robot Award', ['award', 'winner', 'achievement', 'robot', 'robot'], [line('M9.5 7V4.5'), body(R(4, 7, 11, 8, 2.5)), line(D(7.5, 11) + D(11.5, 11)), body('M14 12.8h6v2.7a3 3 0 0 1-6 0Z', { cover: true }), line('M17 18.5v1.7M15 20.6h4M14 13.8h-1v.6a1.6 1.6 0 0 0 1.4 1.6M20 13.8h1v.6a1.6 1.6 0 0 1-1.4 1.6')], { noAccent: true }),
    icon('robot-arm-trophy', 'Robot Arm Award', ['award', 'winner', 'achievement', 'robot arm', 'robot-arm'], [body(R(4, 15.5, 7, 2.5, 0.6)), line('M7.5 15.3V11l5-4.5'), body(C(7.5, 11, 1.4)), body(C(12.5, 6.5, 1.4)), line('M13.8 5.5 15.5 3.5M13.8 7.3l2.2.5'), body('M14 12.8h6v2.7a3 3 0 0 1-6 0Z', { cover: true }), line('M17 18.5v1.7M15 20.6h4M14 13.8h-1v.6a1.6 1.6 0 0 0 1.4 1.6M20 13.8h1v.6a1.6 1.6 0 0 1-1.4 1.6')], { noAccent: true }),
  ],
};
