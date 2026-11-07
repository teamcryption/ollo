import { R, C, L, translateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const BELL = 'M5.2 17.5h13.6l-1.3-2.1v-4.6a5.5 5.5 0 0 0-11 0v4.6Z';

export default {
  category: 'notifications',
  icons: [
    icon('bell-snooze', 'Snooze', ['snooze', 'sleep', 'later', 'quiet', 'remind later'], [body(translateD(BELL, -2, 0)), line('M8 20.2a2.2 2.2 0 0 0 4 0'), accent('M16.5 3.5h3l-3 3.5h3')], { anim: 'wiggle' }),
    icon('notification-stack', 'Notification Stack', ['notifications', 'feed', 'grouped alerts', 'stack', 'messages'], [body(R(3.5, 10, 17, 9.5, 2)), line('M5.5 7h13M7.5 4h9'), accent(C(7.5, 14.75, 1.3)), line(L(11, 13.5, 17, 13.5)), line(L(11, 16, 15, 16))]),
  ],
};
