import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D } from '../src/geo.mjs';

export default {
  category: 'transport',
  icons: [
    icon('trailer', 'Trailer', ['cargo trailer', 'towing', 'hitch', 'haul', 'utility trailer'], [body(R(3.5, 6, 13, 10, 1.5)), body(C(10, 17.5, 2.5), { cover: true }), line('M16.5 14H20.5')], { noAccent: true }),
    icon('jet-ski', 'Jet Ski', ['personal watercraft', 'water scooter', 'sea', 'beach', 'ride'], [body('M3.5 15.5h13.5l3.5-3H16l-3-3H8.5L6.5 12.5H3.5Z'), line('M13 9.5l2-3h2.5'), accent('M4 19.5c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0')]),
  ],
};
