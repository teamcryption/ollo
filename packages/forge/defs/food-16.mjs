import { icon, body, line, accent } from '../src/dsl.mjs';
import { C } from '../src/geo.mjs';

export default {
  category: 'food',
  icons: [
    icon('tomato', 'Tomato', ['vegetable', 'fruit', 'salad', 'red', 'produce'], [body(C(12, 13.5, 7.5)), line('M8.5 7.5 12 9l3.5-1.5M12 9V4.5'), accent('M7.5 14a4.5 4.5 0 0 1 2-3.6')]),
    icon('onion', 'Onion', ['vegetable', 'shallot', 'bulb', 'cooking', 'produce'], [body('M12 3.5c1 3 6.5 5 6.5 10.5a6.5 6.5 0 0 1-13 0c0-5.5 5.5-7.5 6.5-10.5Z'), line('M12 7c-2 3-3 7-2.3 13.3M12 7c2 3 3 7 2.3 13.3')], { noAccent: true }),
    icon('peach', 'Peach', ['fruit', 'apricot', 'nectarine', 'summer', 'produce'], [line('M12.5 6.5c.5-2 2.5-3 4.5-2.5-.5 2-2.5 3-4.5 2.5Z'), body('M12 7.5c-4-2.5-8 .5-8 5.5 0 4.5 3.5 7.5 8 7.5s8-3 8-7.5c0-5-4-8-8-5.5Z'), line('M12 7.5c-1.5 3-1.5 7 0 12.8'), accent('M7 13a3.5 3.5 0 0 1 1.5-2.8')]),
  ],
};
