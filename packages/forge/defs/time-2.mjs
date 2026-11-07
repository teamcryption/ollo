import { R, C, L, A, poly, D, star, scaleD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const RINGS = [line(L(8, 3, 8, 6)), line(L(16, 3, 16, 6))];
const CAL = R(3.5, 4.5, 17, 16, 3);
const HEADER = L(3.7, 9.5, 20.3, 9.5);
const MOON = 'M19.5 14.5A8 8 0 1 1 9.5 4.5a6.5 6.5 0 0 0 10 10Z';

export default {
  category: 'time',
  icons: [
    icon('calendar-clock', 'Calendar Clock', ['schedule', 'appointment', 'meeting time', 'booking', 'deadline'], [...RINGS, body(CAL), line(HEADER), body(C(16.5, 16.5, 4.5), { cover: true }), accent(poly([[16.5, 14.5], [16.5, 16.5], [18, 17.5]], 0.4))], { badges: ['check'] }),
    icon('calendar-week', 'Calendar Week', ['week', 'sprint', 'schedule', 'planner', 'range'], [...RINGS, body(CAL), line(HEADER), accent(L(7.5, 13.5, 16.5, 13.5)), line(D(7.5, 17)), line(D(10.5, 17)), line(D(13.5, 17))]),
    icon('calendar-star', 'Calendar Star', ['event', 'favourite date', 'special', 'holiday', 'milestone'], [...RINGS, body(CAL), line(HEADER), accent(star(12, 15, 3.4, 1.5, 5, 0.4))]),
    icon('alarm-snooze', 'Snooze', ['snooze', 'sleep', 'later', 'remind me', 'alarm'], [line(A(5.5, 5.5, 2.4, 160, 290)), line(A(18.5, 5.5, 2.4, 250, 380)), body(C(12, 13, 7.5)), accent(poly([[9.8, 10.8], [14.2, 10.8], [9.8, 15.2], [14.2, 15.2]], 0.3)), line(L(7, 18.5, 5.5, 20)), line(L(17, 18.5, 18.5, 20))]),
    icon('timeline', 'Timeline', ['history', 'steps', 'roadmap', 'activity', 'sequence'], [line(L(7, 3.5, 7, 20.5)), body(C(7, 6.5, 2), { cover: true }), body(C(7, 12, 2), { cover: true }), body(C(7, 17.5, 2), { cover: true }), line(L(11.5, 6.5, 19.5, 6.5)), accent(L(11.5, 12, 16.5, 12)), line(L(11.5, 17.5, 19, 17.5))]),
    icon('clock-fast', 'Fast Time', ['quick', 'express', 'speed', 'rush', 'fast delivery'], [body(C(14, 12, 6.8)), line(L(3, 9, 5.5, 9)), line(L(3.5, 15, 5.5, 15)), line(L(4.5, 12, 6, 12)), accent(poly([[14, 8.5], [14, 12], [16.5, 13.5]], 0.6))]),
    icon('planner', 'Planner', ['agenda', 'diary', 'notebook', 'organiser', 'journal'], [body(R(5.5, 3.5, 13.5, 17, 2.5)), line(L(3.5, 8, 7.5, 8)), line(L(3.5, 12, 7.5, 12)), line(L(3.5, 16, 7.5, 16)), accent(L(11, 8, 15.5, 8)), line(L(11, 11.5, 15.5, 11.5))]),
    icon('bedtime', 'Bedtime', ['sleep', 'night', 'rest', 'do not disturb', 'quiet hours'], [body(scaleD(MOON, 0.8, 9, 14)), accent(poly([[15.5, 3.5], [19.5, 3.5], [15.5, 7.5], [19.5, 7.5]], 0.3))]),
  ],
};
