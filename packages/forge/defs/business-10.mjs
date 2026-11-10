import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, poly } from '../src/geo.mjs';

export default {
  category: 'business',
  icons: [
    icon('desk', 'Desk', ['office desk', 'workstation', 'table', 'workspace', 'study'], [body(R(3, 8, 18, 2.5, 1)), line('M5 10.5v10'), body(R(13.5, 10.5, 6, 9, 1)), line('M15.5 13.5h2M15.5 16.5h2')], { noAccent: true }),
    icon('meeting-table', 'Meeting Table', ['conference', 'boardroom', 'meeting room', 'team', 'discussion'], [body(R(6.5, 8, 11, 8, 4)), body(R(8, 4, 3, 2.2, 1) + R(13, 4, 3, 2.2, 1) + R(8, 17.8, 3, 2.2, 1) + R(13, 17.8, 3, 2.2, 1) + R(3, 10.5, 2.2, 3, 1) + R(18.8, 10.5, 2.2, 3, 1))], { noAccent: true }),
    icon('lectern', 'Lectern', ['podium', 'speech', 'presentation', 'conference', 'speaker'], [line('M16 6l1.5-3'), body(poly([[5, 6], [19, 6], [17.5, 10], [6.5, 10]], 0.8, true)), body(poly([[9.5, 10], [14.5, 10], [15, 20.5], [9, 20.5]], 0.6, true)), line('M6.5 20.5h11')], { noAccent: true }),
    icon('flipchart', 'Flipchart', ['presentation', 'workshop', 'easel pad', 'brainstorm', 'meeting'], [line('M3.5 4h17M8 15 6.5 20.5M16 15l1.5 5.5M12 15v5.5'), body(R(4.5, 4, 15, 11, 1)), accent('M7.5 12l3-3 2.5 2 3.5-3.5')]),
    icon('turnstile', 'Turnstile', ['gate', 'entrance', 'access control', 'subway', 'stadium'], [body(R(5, 5, 5, 15.5, 1.5)), line('M10 10h9.5M10 10l7 5.5M3.5 20.5h8')], { noAccent: true }),
    icon('escalator', 'Escalator', ['moving stairs', 'mall', 'airport', 'station', 'up'], [body(poly([[3.5, 16.5], [8, 16.5], [16, 7.5], [20.5, 7.5], [20.5, 10.5], [17.3, 10.5], [9.3, 19.5], [3.5, 19.5]], 1, true)), line('M3.5 13.5h3.5l8-9h5.5')], { noAccent: true }),
  ],
};
