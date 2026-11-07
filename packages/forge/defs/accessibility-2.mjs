import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'accessibility',
  icons: [
    icon('audio-description', 'Audio Description', ['ad', 'described video', 'blind', 'narration'], [body(R(3, 5, 18, 14, 2.5)), line(poly([[6.5, 16], [9, 8], [11.5, 16]], 0.3)), line(L(7.4, 13.2, 10.6, 13.2)), line('M13.5 8H15a4 4 0 0 1 0 8h-1.5Z')], { noAccent: true }),
    icon('screen-reader', 'Screen Reader', ['text to speech', 'read aloud', 'voiceover', 'narrator'], [body(R(3, 4, 12.5, 10, 2)), line(L(9.25, 14.2, 9.25, 17)), line(L(6.5, 17.5, 12, 17.5)), accent(A(16, 9, 3, -45, 45)), line(A(16, 9, 5, -40, 40))]),
    icon('vibrate', 'Vibrate', ['haptics', 'vibration', 'silent mode', 'buzz'], [body(R(8, 4, 8, 16, 2)), line(L(5, 8, 5, 16)), line(L(19, 8, 19, 16)), line(L(3, 10, 3, 14)), line(L(21, 10, 21, 14)), accent(L(10.5, 7, 13.5, 7))], { anim: 'wiggle' }),
    icon('elevator', 'Elevator', ['lift', 'accessible', 'floors', 'up down'], [body(R(4, 3, 16, 18, 2)), line(L(12, 3.2, 12, 20.8)), line(poly([[6, 12], [8, 10], [10, 12]], 0.3)), accent(poly([[14, 12], [16, 14], [18, 12]], 0.3))]),
  ],
};
