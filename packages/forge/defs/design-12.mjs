import { icon, body, line } from '../src/dsl.mjs';
import { R, poly } from '../src/geo.mjs';

export default {
  category: 'design',
  icons: [
    icon('perspective', 'Perspective', ['vanishing point', 'depth', '3d grid', 'distort', 'transform'], [body(poly([[7, 5], [17, 5], [21, 19], [3, 19]], 1, true)), line('M10.3 5.2 9 18.8M13.7 5.2 15 18.8M5 12h14')], { noAccent: true }),
    icon('pattern', 'Pattern', ['stripes', 'texture', 'fill pattern', 'repeat', 'swatch'], [body(R(3.5, 3.5, 17, 17, 2.5)), line('M7 20.3 20.3 7M3.7 16.3 16.3 3.7M3.7 10.7l7-7M13.3 20.3l7-7')], { noAccent: true }),
  ],
};
