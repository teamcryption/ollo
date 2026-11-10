import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, E, poly } from '../src/geo.mjs';

const MAPLE = [[12, 3], [13.6, 6.4], [16.2, 5.2], [15.6, 9.2], [19.6, 7.8], [18.2, 11.6], [20.6, 12.8], [16.4, 15.4], [17, 17.2], [12.8, 16.2], [11.2, 16.2], [7, 17.2], [7.6, 15.4], [3.4, 12.8], [5.8, 11.6], [4.4, 7.8], [8.4, 9.2], [7.8, 5.2], [10.4, 6.4]];
const SPROUT = 'M12 13c0-2 1.5-3 3.5-3 0 2-1.5 3-3.5 3Z';

export default {
  category: 'nature',
  icons: [
    icon('maple-leaf', 'Maple Leaf', ['autumn', 'fall', 'canada', 'leaf', 'foliage'], [body(poly(MAPLE, 0.4, true)), line('M12 16.2v4.3')], { noAccent: true }),
    icon('rose', 'Rose', ['flower', 'love', 'romance', 'valentine', 'bloom'], [body('M7 6.5c1.5 1 3 1.2 5 0s3.5-1 5 0V10a5 5 0 0 1-10 0Z'), line('M9.5 9c1.2 1 3.8 1 5 0'), line('M12 15v5.5M12 18c1.5-2 3.5-2.2 5-1.5-1 1.8-3 2.3-5 1.5')], { noAccent: true }),
    icon('fern', 'Fern', ['frond', 'plant', 'forest', 'greenery', 'botanical'], [line('M7 20.5c1-6 4.5-12 11-16'), line('M8 16.5 5 15.5M8 16.5l3 .5M10 12.5 7 11M10 12.5l3 .2M12.5 9 10 7M12.5 9h3M15.5 6 14 3.5M15.5 6l3 .5')], { noAccent: true }),
    icon('pitchfork', 'Pitchfork', ['hay fork', 'farm', 'garden fork', 'harvest', 'tool'], [line('M8 3.5V7a4 4 0 0 0 8 0V3.5M12 3.5v17')], { noAccent: true }),
    icon('seed-packet', 'Seed Packet', ['seeds', 'sowing', 'gardening', 'plant', 'spring'], [body(R(5, 3, 14, 18, 1.5)), line('M5 6.5h14'), accent('M12 17v-4' + SPROUT)]),
    icon('terrarium', 'Terrarium', ['glass jar', 'plant', 'cloche', 'mini garden', 'decor'], [line('M5 18v-6a7 7 0 0 1 14 0v6'), body(R(3.5, 18, 17, 2.5, 1)), accent('M12 16v-3' + SPROUT + 'M12 14.5c0-1.6-1.2-2.5-2.8-2.5 0 1.6 1.2 2.5 2.8 2.5Z')]),
    icon('greenhouse', 'Greenhouse', ['glasshouse', 'nursery', 'gardening', 'grow', 'farm'], [body(poly([[3.5, 20.5], [3.5, 10], [12, 4], [20.5, 10], [20.5, 20.5]], 1, true)), line('M8.5 7v13.5M15.5 7v13.5M3.5 14h17')], { noAccent: true }),
    icon('compost-bin', 'Compost Bin', ['compost', 'organic waste', 'recycling', 'garden', 'eco'], [line('M4 7h16M10 7V5h4v2'), body(R(5, 7, 14, 13.5, 1.5)), accent('M12 17c0-3 1.8-4.5 4-4.5 0 3-1.8 4.5-4 4.5Z')]),
    icon('bonsai', 'Bonsai', ['tree', 'zen', 'miniature tree', 'japanese', 'plant'], [line('M12 17c0-3-2-4-2-6s2-3 2-5'), body(E(8, 10, 3.2, 2)), body(E(15.5, 8, 3.5, 2.2)), body(E(11, 5.5, 3, 1.9)), body(R(6, 17, 12, 3.5, 1))], { noAccent: true }),
  ],
};
