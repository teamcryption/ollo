import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, poly } from '../src/geo.mjs';

export default {
  category: 'tools',
  icons: [
    icon('jackhammer', 'Jackhammer', ['pneumatic drill', 'breaker', 'roadwork', 'demolition', 'construction'], [line('M6 4h12'), body(R(9, 4, 6, 9, 1.5)), line('M12 13v7.5'), accent('M8 20.5 6.5 19M16 20.5l1.5-1.5')], { anim: 'wiggle' }),
    icon('plumb-bob', 'Plumb Bob', ['plumb line', 'vertical', 'level', 'surveying', 'construction'], [line('M12 3v5'), body(poly([[12, 20.5], [16, 12], [14.5, 8], [9.5, 8], [8, 12]], 0.8, true))], { noAccent: true }),
    icon('vise', 'Vise', ['vice', 'clamp', 'workbench', 'grip', 'workshop'], [body(R(3.5, 17, 16, 3.5, 1)), body(R(4.5, 10, 5, 7, 1)), body(R(13.5, 10, 5, 7, 1)), line('M18.5 13.5h2.5M21 10.5v6')], { noAccent: true }),
  ],
};
