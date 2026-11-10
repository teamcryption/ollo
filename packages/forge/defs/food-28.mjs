import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, poly } from '../src/geo.mjs';

export default {
  category: 'food',
  icons: [
    icon('bell-pepper', 'Bell Pepper', ['capsicum', 'paprika', 'vegetable', 'salad', 'sweet pepper'], [line('M12 7V5c0-.8.6-1.5 1.5-1.5'), body('M12 7c-1.5-1-4.5-1-6 1-2 2.5-1.5 7 0 10 1 2 2.8 3 4 2.3.8-.5 1.2-.5 2 0 1.2.7 3-.3 4-2.3 1.5-3 2-7.5 0-10-1.5-2-4.5-2-6-1Z'), line('M12 10.5v7')], { noAccent: true }),
    icon('gravy-boat', 'Gravy Boat', ['sauce boat', 'gravy', 'thanksgiving', 'roast dinner', 'jug'], [body('M3 11h13.5c2 0 3.5-1 4.5-2.5-.3 4.5-3 8.5-8 8.5H9.5C6 17 3.5 14.5 3 11Z'), line('M8 19.5h6')], { noAccent: true }),
  ],
};
