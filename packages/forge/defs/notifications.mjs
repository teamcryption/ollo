import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const BELL = 'M5.2 17.5h13.6l-1.3-2.1v-4.6a5.5 5.5 0 0 0-11 0v4.6Z';
const CLAPPER = 'M10 20.2a2.2 2.2 0 0 0 4 0';

export default {
  category: 'notifications',
  icons: [
    icon('bell-dot', 'Bell Dot', ['notification', 'unread', 'new', 'alert'], [body(BELL), accent(CLAPPER), body(C(17.5, 5.5, 2.4), { cover: true })], { anim: 'wiggle' }),
    icon('bell-off', 'Bell Off', ['mute', 'silent', 'disable notifications', 'quiet'], [body(BELL), accent(CLAPPER), line(L(4.5, 4.5, 19.5, 19.5), { cover: true })], { anim: 'wiggle' }),
    icon('bell-ring', 'Bell Ring', ['ringing', 'alarm', 'notify', 'reminder'], [body(BELL), accent(CLAPPER), line(A(12, 10.5, 9.5, 205, 235)), line(A(12, 10.5, 9.5, 305, 335))], { anim: 'wiggle' }),
    icon('bell-plus', 'Bell Add', ['subscribe', 'add notification', 'reminder', 'new alert'], [body(BELL), accent(CLAPPER), line(L(10, 11.5, 14, 11.5)), line(L(12, 9.5, 12, 13.5))], { anim: 'wiggle' }),
    icon('notification-square', 'Notification Badge', ['badge', 'unread', 'app', 'counter'], [body(R(4, 5, 15, 15, 3.5)), body(C(18.5, 5.5, 2.6), { cover: true }), accent(L(8, 13, 13.5, 13))], { anim: 'pulse' }),
    icon('envelope-dot', 'Unread Mail', ['email', 'unread', 'inbox', 'new message'], [body(R(3, 6, 15.5, 13, 2.5)), line('M3.4 7.8l6.3 4.3a1.6 1.6 0 0 0 1.8 0l6.4-4.3'), body(C(19, 5.5, 2.4), { cover: true }), accent(L(6.5, 16, 9.5, 16))]),
    icon('siren', 'Siren', ['emergency', 'alarm', 'alert', 'police', 'urgent'], [body('M7 17v-5a5 5 0 0 1 10 0v5Z'), line(R(4.5, 17, 15, 3.3, 1.2)), accent('M10.2 12.6a1.8 1.8 0 0 1 1.8-1.8'), line(L(12, 2.5, 12, 4)), line(L(4.2, 6, 5.3, 7.1)), line(L(19.8, 6, 18.7, 7.1))], { anim: 'pulse' }),
    icon('inbox-badge', 'Inbox Badge', ['notifications', 'inbox', 'tray', 'updates'], [body('M4 13.5 6.3 6.3A2.5 2.5 0 0 1 8.7 4.5h6.6a2.5 2.5 0 0 1 2.4 1.8L20 13.5v4A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5Z'), line('M4.2 13.5H8.5l1.2 2h4.6l1.2-2h4.3'), body(C(18.5, 5.5, 2.6), { cover: true }), accent(L(9.5, 9.5, 13, 9.5))]),
  ],
};
