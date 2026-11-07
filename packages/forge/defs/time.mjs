import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'time',
  icons: [
    icon('clock', 'Clock', ['time', 'hour', 'watch', 'schedule', 'pending'], [body(C(12, 12, 8.5)), accent(poly([[12, 7.5], [12, 12], [15, 14]], 0.8))], { anim: 'pop-draw', badges: ['check', 'alert', 'add'] }),
    icon('alarm', 'Alarm Clock', ['alarm', 'wake up', 'timer', 'reminder', 'morning'], [line(A(5.5, 5.5, 2.4, 160, 290)), line(A(18.5, 5.5, 2.4, 250, 380)), body(C(12, 13, 7.5)), accent(poly([[12, 9.5], [12, 13], [14.5, 14.5]], 0.7)), line(L(7, 18.5, 5.5, 20)), line(L(17, 18.5, 18.5, 20))], { anim: 'wiggle' }),
    icon('hourglass', 'Hourglass', ['time', 'wait', 'loading', 'sand', 'timer'], [line(L(6, 3.5, 18, 3.5)), line(L(6, 20.5, 18, 20.5)), body('M7.5 3.8V6a4.5 4.5 0 0 0 2 3.7L12 11.5l2.5-1.8A4.5 4.5 0 0 0 16.5 6V3.8Z'), body('M7.5 20.2V18a4.5 4.5 0 0 1 2-3.7l2.5-1.8 2.5 1.8a4.5 4.5 0 0 1 2 3.7v2.2Z'), accent(L(10.5, 18, 13.5, 18))], { anim: 'spin' }),
    icon('stopwatch', 'Stopwatch', ['timer', 'speed', 'lap', 'sport', 'countdown'], [line(L(10, 2.8, 14, 2.8)), line(L(12, 3, 12, 4.8)), line(L(18.2, 6.6, 19.4, 5.4)), body(C(12, 13, 7.5)), accent(L(12, 13, 14.5, 10.5))], { anim: 'spin' }),
    icon('timer', 'Timer', ['countdown', 'duration', 'time', 'pomodoro'], [line(A(12, 12, 8.5, -60, 240)), accent(L(12, 3.5, 12, 5.6)), body('M12 12V7.6a4.4 4.4 0 1 1-3.1 7.5Z')], { anim: 'spin' }),
    icon('history', 'History', ['recent', 'past', 'log', 'restore', 'time'], [line(A(12, 12, 8.3, 160, 520)), line(poly([[3.5, 9.5], [3.9, 13], [7, 12]], 0.5)), accent(poly([[12, 8], [12, 12], [14.8, 13.6]], 0.7))], { anim: 'spin' }),
    icon('calendar-plain', 'Calendar Plain', ['date', 'schedule', 'event', 'month', 'day'], [line(L(8, 3, 8, 6)), line(L(16, 3, 16, 6)), body(R(3.5, 4.5, 17, 16, 3)), line(L(3.7, 9.5, 20.3, 9.5)), accent(R(7.5, 13, 3, 3, 0.8))], { badges: ['add', 'remove', 'check', 'close'] }),
    icon('calendar-days', 'Calendar Days', ['date', 'month', 'planner', 'agenda', 'grid'], [line(L(8, 3, 8, 6)), line(L(16, 3, 16, 6)), body(R(3.5, 4.5, 17, 16, 3)), line(L(3.7, 9.5, 20.3, 9.5)), line(D(8, 13)), line(D(12, 13)), line(D(16, 13)), line(D(8, 16.5)), accent(D(12, 16.5))]),
    icon('watch', 'Watch', ['smartwatch', 'wrist', 'time', 'wearable'], [line('M8.5 6.5 9 3.5h6l.5 3'), line('M8.5 17.5 9 20.5h6l.5-3'), body(R(6, 6.5, 12, 11, 3)), accent(poly([[12, 9.5], [12, 12], [13.8, 13.2]], 0.6))]),
  ],
};
