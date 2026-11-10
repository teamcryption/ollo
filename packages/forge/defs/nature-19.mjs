import { icon, body, line } from '../src/dsl.mjs';
import { R, E, poly } from '../src/geo.mjs';

const ring = (r) => poly([0, 45, 90, 135, 180, 225, 270, 315].map((a) => [12 + r * Math.cos((a * Math.PI) / 180), 12 + r * Math.sin((a * Math.PI) / 180)]), 0.3, true);

export default {
  category: 'nature',
  icons: [
    icon('pine-cone', 'Pine Cone', ['conifer', 'forest', 'autumn', 'seed', 'woodland'], [line('M12 5.5V3.5'), body(E(12, 13, 5.5, 7.5)), line('M8 10l4 2.5 4-2.5M7 13.5l5 3 5-3M8.5 17l3.5 2 3.5-2')], { noAccent: true }),
    icon('egg-cracked', 'Cracked Egg', ['hatch', 'egg', 'break', 'easter', 'new beginning'], [body('M12 3.5c3.3 0 6 5 6 9.5a6 6 0 0 1-12 0c0-4.5 2.7-9.5 6-9.5Z'), line('M6.6 12.5l2 1.5 2-2 2 2 2-2 2.8 1.6')], { noAccent: true }),
    icon('spider-web', 'Spider Web', ['cobweb', 'halloween', 'web', 'spooky', 'network'], [line('M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4'), line(ring(4)), line(ring(7.5))], { noAccent: true }),
  ],
};
