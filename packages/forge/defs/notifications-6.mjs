import { icon, body, line } from '../src/dsl.mjs';
import { R } from '../src/geo.mjs';

export default {
  category: 'notifications',
  icons: [
    icon('event-reminder', 'Event Reminder', ['calendar alert', 'upcoming event', 'reminder', 'schedule notification', 'due date'], [body(R(3, 5.5, 13, 13, 2.5)), line('M3.2 9.5h12.6'), line('M6.5 3.5v3.5M12.5 3.5v3.5'), body('M16.5 11.5a3.5 3.5 0 0 1 3.5 3.5v2.5l1 1.5h-9l1-1.5V15a3.5 3.5 0 0 1 3.5-3.5Z', { cover: true }), line('M15.3 20.5h2.4')], { noAccent: true, anim: 'wiggle' }),
  ],
};
