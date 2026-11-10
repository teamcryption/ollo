import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, poly } from '../src/geo.mjs';

export default {
  category: 'science',
  icons: [
    icon('lunar-lander', 'Lunar Lander', ['moon landing', 'apollo', 'spacecraft', 'module', 'space'], [body(poly([[9, 4.5], [15, 4.5], [17, 7.5], [17, 12], [7, 12], [7, 7.5]], 1, true)), line('M8.5 12 5 19.5M15.5 12l3.5 7.5M3.5 19.5h3M17.5 19.5h3'), body(poly([[10.5, 12], [13.5, 12], [14.5, 15], [9.5, 15]], 0.5, true))], { noAccent: true }),
    icon('mars-rover', 'Mars Rover', ['rover', 'planetary', 'exploration', 'space', 'robot'], [line('M9 9V5.5h2.5'), body(R(11.5, 4, 3.5, 3, 0.8)), body(R(5, 9, 14, 4, 1)), line('M7 13l-1 2.5M12 13v2.5M17 13l1 2.5'), body(C(6, 17.5, 2) + C(12, 17.5, 2) + C(18, 17.5, 2), { cover: true })], { noAccent: true }),
  ],
};
