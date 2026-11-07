import { R, C, L, A, poly, D, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const octagon = Array.from({ length: 8 }, (_, i) => {
  const a = ((22.5 + i * 45) * Math.PI) / 180;
  return [12 + 8.8 * Math.cos(a), 12 + 8.8 * Math.sin(a)];
});
const BANG = 'M12 7.5v5.5M12 16.3v.1';
const BELL = 'M6.5 15.5V11a5.5 5.5 0 0 1 11 0v4.5l1.1 1.3c.4.5.1 1.2-.6 1.2H6c-.7 0-1-.7-.6-1.2Z';

export default {
  category: 'notifications',
  icons: [
    icon('alert-octagon', 'Alert Octagon', ['error', 'stop', 'critical', 'danger'], [body(poly(octagon, 1.2, true)), accent(BANG)], { anim: 'wiggle' }),
    icon('alert-diamond', 'Alert Diamond', ['warning', 'caution', 'attention', 'notice'], [body(rotateD(R(5.5, 5.5, 13, 13, 2.5), 45)), accent(BANG)], { anim: 'wiggle' }),
    icon('push-notification', 'Push Notification', ['mobile alert', 'notification', 'banner', 'app alert'], [body(R(6, 3, 12, 18, 2.5)), line(R(8.2, 5.5, 7.6, 4, 1)), accent(L(10.5, 17.5, 13.5, 17.5))], { anim: 'wiggle' }),
    icon('bell-clock', 'Reminder', ['reminder', 'scheduled alert', 'snooze', 'later'], [body(BELL), line(L(10.5, 20.2, 13.5, 20.2)), line(L(12, 3.5, 12, 4.2)), body(C(17, 16.5, 4), { cover: true }), accent(poly([[17, 14.8], [17, 16.5], [18.3, 17.3]], 0.3))], { anim: 'wiggle' }),
  ],
};
