import { C, L, A } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'people',
  icons: [
    icon('person', 'Person', ['human', 'figure', 'standing', 'individual'], [body(C(12, 5, 2)), line('M12 8v6M8.5 10.5h7M12 14l-2.5 6M12 14l2.5 6')], { noAccent: true }),
    icon('user-voice', 'User Speaking', ['speaker', 'talk', 'voice', 'presenter'], [body(C(9, 8, 3.5)), body('M3 19.5c.5-3 3-5 6-5s5.5 2 6 5Z'), accent(A(16, 8, 3, -45, 45))], { anim: 'pulse' }),
  ],
};
