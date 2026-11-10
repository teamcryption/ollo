import { icon, body, line } from '../src/dsl.mjs';
import { R, C } from '../src/geo.mjs';

const CLOCK = [body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')];

export default {
  category: 'communication',
  icons: [
    icon('mail-clock', 'Scheduled Email', ['send later', 'scheduled mail', 'delayed send', 'email timer', 'outbox'], [body(R(3, 5, 14.5, 11, 2)), line('M5.5 8l4.75 3 4.75-3'), ...CLOCK], { noAccent: true }),
    icon('message-clock', 'Scheduled Message', ['send later', 'scheduled text', 'timed message', 'reminder', 'chat'], [body('M5.5 4h9A2.5 2.5 0 0 1 17 6.5v5a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3A2.5 2.5 0 0 1 3 11.5v-5A2.5 2.5 0 0 1 5.5 4Z'), ...CLOCK], { noAccent: true }),
  ],
};
