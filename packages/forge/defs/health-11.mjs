import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C } from '../src/geo.mjs';

export default {
  category: 'health',
  icons: [
    icon('clipboard-heart', 'Health Record', ['medical record', 'chart', 'wellness', 'patient', 'clipboard'], [body(R(5, 4.5, 14, 16.5, 2.5)), body(R(9, 3, 6, 3.5, 1.5), { cover: true }), accent('M12 16.7l-2.9-2.8a1.8 1.8 0 0 1 2.9-2.2 1.8 1.8 0 0 1 2.9 2.2Z')]),
    icon('walker', 'Walker', ['walking frame', 'mobility aid', 'elderly', 'rehab', 'zimmer frame'], [line('M6 7h12'), line('M7.5 7 6.3 17.8M16.5 7l1.2 10.8'), line('M7 12.5h10'), body(C(6.3, 19.3, 1.3)), body(C(17.7, 19.3, 1.3))], { noAccent: true }),
  ],
};
