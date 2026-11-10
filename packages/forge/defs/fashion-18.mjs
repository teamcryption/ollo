import { icon, body, line } from '../src/dsl.mjs';
import { R, D, E } from '../src/geo.mjs';

export default {
  category: 'fashion',
  icons: [
    icon('thread-spool', 'Thread Spool', ['bobbin', 'sewing thread', 'cotton reel', 'tailoring', 'craft'], [body(R(7.5, 6, 9, 12, 0.5)), line('M7.7 9h8.6M7.7 12h8.6M7.7 15h8.6'), body(R(6, 3.5, 12, 2.5, 1), { cover: true }), body(R(6, 18, 12, 2.5, 1), { cover: true }), line('M16.5 14c2 0 3.5 1.5 3.5 3.5')], { noAccent: true }),
  ],
};
