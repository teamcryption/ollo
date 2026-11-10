import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, L, poly } from '../src/geo.mjs';

export default {
  category: 'business',
  icons: [
    icon('letter-tray', 'Letter Tray', ['inbox tray', 'paper tray', 'in tray', 'documents', 'desk organiser'], [line('M7 7V4.5h8.5V7'), body(R(3.5, 7, 17, 4.5, 1.2)), body(R(3.5, 14.5, 17, 4.5, 1.2)), line('M5.5 11.5v3M18.5 11.5v3M5.5 19v1.5M18.5 19v1.5')], { noAccent: true }),
    icon('pen-holder', 'Pen Holder', ['pencil cup', 'desk tidy', 'stationery', 'pens', 'office supplies'], [line('M9.5 11 8 4.5M12 11V3.5M14.5 11l2.5-5.5'), body(R(7, 11, 10, 9.5, 2))], { noAccent: true }),
    icon('notepad', 'Notepad', ['legal pad', 'memo pad', 'notes', 'jotter', 'writing pad'], [body(R(5, 4.5, 14, 16.5, 2)), body(R(4.5, 3, 15, 3.5, 1.2), { cover: true }), line('M8 10.5h8M8 13.5h8'), accent(L(8, 17, 12, 17))]),
    icon('resume', 'Resume', ['cv', 'curriculum vitae', 'job application', 'profile', 'hiring'], [body(R(5, 3, 14, 18, 2.5)), line(C(9.5, 8, 1.8)), line('M7.2 13a2.5 2.5 0 0 1 4.6 0'), line('M14 7.5h2.5M14 10.5h2.5'), accent(L(8, 17, 16, 17))]),
  ],
};
