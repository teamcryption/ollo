import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, rotateD } from '../src/geo.mjs';

export default {
  category: 'sports',
  icons: [
    icon('ski-lift', 'Ski Lift', ['chairlift', 'gondola', 'ski resort', 'mountain', 'winter'], [line('M3 6.5 21 3.5M12 5v5H8v7'), body(R(8, 15, 9, 2.5, 1))], { noAccent: true }),
    icon('ice-axe', 'Ice Axe', ['mountaineering', 'climbing', 'alpine', 'pick', 'summit'], [line('M12 7.5v13'), body('M4.5 6.5C8 4 15 3.5 19.5 4.5V7H8c-1.3 0-2.5.4-3.5-.5Z')], { noAccent: true }),
  ],
};
