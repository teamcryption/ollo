import { R } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

const TICKS = [30, 60, 90, 120, 150].map((a) => {
  const r = (a * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
  return `M${(12 + 6.6 * c).toFixed(2)} ${(16.5 - 6.6 * s).toFixed(2)}L${(12 + 8.5 * c).toFixed(2)} ${(16.5 - 8.5 * s).toFixed(2)}`;
}).join('');

export default {
  category: 'education',
  icons: [
    icon('protractor', 'Protractor', ['angle', 'geometry', 'measure', 'math', 'degrees'], [body('M3.5 16.5a8.5 8.5 0 0 1 17 0Z'), line(TICKS), line('M9.5 16.5a2.5 2.5 0 0 1 5 0')], { noAccent: true }),
    icon('easel', 'Easel', ['painting', 'art', 'canvas', 'artist', 'studio'], [line('M12 3.5V6M8.5 20.5l1.5-5M15.5 20.5l-1.5-5M12 15.5v5'), body(R(5, 6, 14, 9.5, 1)), line('M8 13l3-3 2 2 1.5-1.5 2 2.5')], { noAccent: true }),
  ],
};
