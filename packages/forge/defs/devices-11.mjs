import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D } from '../src/geo.mjs';

export default {
  category: 'devices',
  icons: [
    icon('flip-phone', 'Flip Phone', ['clamshell', 'feature phone', 'mobile', 'retro phone', 'cell phone'], [body(R(7, 3, 10, 8, 2)), body(R(7, 12.5, 10, 8.5, 2)), line(D(9.5, 15.5) + D(12, 15.5) + D(14.5, 15.5) + D(9.5, 18) + D(12, 18) + D(14.5, 18))], { noAccent: true }),
    icon('satellite-phone', 'Satellite Phone', ['sat phone', 'expedition', 'remote', 'emergency', 'field'], [body(R(12.5, 3, 3, 6, 1.5)), body(R(7, 8, 9, 12.5, 2), { cover: true }), line(R(9, 10.5, 5, 3.5, 0.6)), line(D(9.5, 16.5) + D(11.5, 16.5) + D(13.5, 16.5))], { noAccent: true }),
    icon('tripod', 'Tripod', ['camera stand', 'photography', 'mount', 'video', 'stabilizer'], [body(R(8, 3.5, 8, 4, 1)), line('M12 7.5v4M12 11.5 6 20.5M12 11.5l6 9M12 11.5v9')], { noAccent: true }),
    icon('ring-light', 'Ring Light', ['selfie light', 'streaming', 'content creator', 'lighting', 'vlog'], [line(C(12, 9, 6)), body(R(10.5, 6.5, 3, 5, 0.8)), line('M12 15v5.5M8.5 20.5h7')], { noAccent: true }),
    icon('mixer-board', 'Mixing Console', ['mixer', 'audio', 'dj', 'sound desk', 'studio'], [body(R(3, 5, 18, 14, 2)), line('M7 8v8M12 8v8M17 8v8'), body(R(5.8, 9, 2.4, 2, 0.5) + R(10.8, 12.5, 2.4, 2, 0.5) + R(15.8, 10, 2.4, 2, 0.5))], { noAccent: true }),
  ],
};
