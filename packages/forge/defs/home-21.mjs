import { icon, body, line } from '../src/dsl.mjs';
import { R, E } from '../src/geo.mjs';

export default {
  category: 'home',
  icons: [
    icon('pipe-elbow', 'Pipe Elbow', ['plumbing', 'pipe', 'fitting', 'plumber', 'water pipe'], [body('M5 7h5.5a6 6 0 0 1 6 6v6h-5v-6a1 1 0 0 0-1-1H5Z'), body(R(3.5, 6, 2, 7, 0.6) + R(10.5, 19, 7, 2, 0.6), { cover: true })], { noAccent: true }),
    icon('water-valve', 'Water Valve', ['shutoff valve', 'plumbing', 'tap', 'pipe', 'main valve'], [line(E(12, 6.5, 5.5, 2.2)), line('M6.5 6.5h11M12 8.7V14'), body(R(3.5, 14, 17, 5, 1.5))], { noAccent: true }),
  ],
};
