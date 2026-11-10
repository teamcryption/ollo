import { icon, body, line } from '../src/dsl.mjs';
import { R, C, poly } from '../src/geo.mjs';

export default {
  category: 'time',
  icons: [
    icon('cuckoo-clock', 'Cuckoo Clock', ['clock', 'pendulum', 'chalet', 'bird', 'vintage'], [body(poly([[12, 3], [20.5, 9.5], [18, 9.5], [18, 16.5], [6, 16.5], [6, 9.5], [3.5, 9.5]], 0.8, true)), line(C(12, 11.8, 2.8)), line('M12 10.4v1.4l1 .8'), line('M9.5 16.5v2.3M14.5 16.5v1'), body(R(8.6, 18.8, 1.8, 1.7, 0.5) + R(13.6, 17.5, 1.8, 1.7, 0.5))], { noAccent: true }),
  ],
};
