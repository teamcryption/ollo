import { C } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'people',
  icons: [
    icon('user-voice', 'User Speaking', ['speaker', 'voice', 'talk', 'presenter', 'speech'], [body(C(9.5, 8.5, 3.2)), body('M3.5 19.5a6 6 0 0 1 12 0Z'), accent('M17 6.5a4 4 0 0 1 0 5'), line('M19.5 4.5a7 7 0 0 1 0 9')]),
    icon('stroller', 'Stroller', ['baby carriage', 'pram', 'pushchair', 'baby', 'parent'], [body('M12 4a7 7 0 0 0-7 7h7Z'), body('M4.5 11h15c0 3-3 5-7.5 5s-7.5-2-7.5-5Z'), line('M19.5 11 21 7.5'), body(C(8, 19.2, 1.3)), body(C(16, 19.2, 1.3))], { noAccent: true }),
  ],
};
