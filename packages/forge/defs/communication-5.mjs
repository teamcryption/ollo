import { R } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'communication',
  icons: [
    icon('mail-forward', 'Forward Mail', ['forward email', 'send on', 'pass along', 'redirect mail'], [body(R(3, 3.5, 14, 10, 2.5)), line('M6.3 7l3.7 2.6 3.7-2.6'), accent('M14 18.5h6.5M18 16l2.5 2.5-2.5 2.5')]),
    icon('outbox', 'Outbox', ['outgoing', 'sent', 'send', 'out tray', 'pending mail'], [body('M3.5 13v5A2.5 2.5 0 0 0 6 20.5h12a2.5 2.5 0 0 0 2.5-2.5v-5H16l-1.5 2.5h-5L8 13Z'), accent('M12 3.5V10M9 6.5l3-3 3 3')]),
  ],
};
