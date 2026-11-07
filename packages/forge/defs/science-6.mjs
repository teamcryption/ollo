import { R, C } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'science',
  icons: [
    icon('astronaut', 'Astronaut', ['spaceman', 'cosmonaut', 'space suit', 'nasa', 'explorer'], [body('M4.5 20.5c0-2.5 3.3-4.5 7.5-4.5s7.5 2 7.5 4.5Z'), body(C(12, 10, 6.5), { cover: true }), line(R(8, 7.5, 8, 5.5, 2.5))], { noAccent: true }),
  ],
};
