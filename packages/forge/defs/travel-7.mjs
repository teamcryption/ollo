import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, poly } from '../src/geo.mjs';

export default {
  category: 'travel',
  icons: [
    icon('sandcastle', 'Sandcastle', ['sand castle', 'beach', 'bucket', 'summer', 'kids'], [body(poly([[3.5, 20.5], [4.2, 13], [7.3, 13], [8, 20.5]], 0.6, true)), body(poly([[16, 20.5], [16.7, 13], [19.8, 13], [20.5, 20.5]], 0.6, true)), body(poly([[9, 20.5], [9.7, 9], [14.3, 9], [15, 20.5]], 0.6, true)), line('M12 9V4l3 1.25L12 6.5')], { noAccent: true }),
    icon('diving-mask', 'Diving Mask', ['snorkel', 'scuba', 'dive', 'swim', 'underwater'], [body('M6 8h7.5a3 3 0 0 1 3 3v2.5a3 3 0 0 1-3 3h-1.8l-1.3-1.9a1.6 1.6 0 0 0-2.6 0l-1.3 1.9H6a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3Z'), line('M19.5 3.5v11a3.5 3.5 0 0 1-3.5 3.5h-1.5'), accent('M6 12.5l2-2')]),
    icon('flip-flops', 'Flip-flops', ['sandals', 'slippers', 'beach', 'summer', 'footwear'], [body(R(4, 5.5, 6.5, 15, 3.25)), body(R(13.5, 3.5, 6.5, 15, 3.25)), line('M4.8 12.5 7.25 9l2.45 3.5M14.3 10.5l2.45-3.5 2.45 3.5')], { noAccent: true }),
    icon('sunscreen', 'Sunscreen', ['sunblock', 'lotion', 'spf', 'beach', 'skincare'], [body(poly([[7, 3.5], [17, 3.5], [15.5, 16], [8.5, 16]], 1, true)), body(R(9, 16, 6, 4.5, 1), { cover: true }), line('M7.3 5.8h9.4'), accent(C(12, 10, 1.8))]),
  ],
};
