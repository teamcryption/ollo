import { icon, body, line } from '../src/dsl.mjs';
import { R, C, D } from '../src/geo.mjs';

export default {
  category: 'business',
  icons: [
    icon('desk-phone', 'Desk Phone', ['office phone', 'landline', 'reception', 'telephone', 'extension'], [body('M4 7.5C4 6.1 5.1 5 6.5 5h11C18.9 5 20 6.1 20 7.5V8a1.5 1.5 0 0 1-1.5 1.5h-2A1.5 1.5 0 0 1 15 8v-.5H9V8a1.5 1.5 0 0 1-1.5 1.5h-2A1.5 1.5 0 0 1 4 8Z'), body(R(3.5, 11, 17, 9, 2.5)), line(D(9, 14) + D(12, 14) + D(15, 14) + D(9, 17) + D(12, 17) + D(15, 17))], { noAccent: true }),
    icon('timesheet', 'Timesheet', ['hours', 'time tracking', 'attendance', 'shift log', 'work hours'], [body(R(4, 5, 13, 15.5, 2.5)), body(R(7.5, 3.5, 6, 3, 1), { cover: true }), line('M7.5 10.5h6M7.5 13.5h3'), body(C(17, 16.5, 3.8), { cover: true }), line('M17 14.7v1.8l1.2 1')], { noAccent: true }),
  ],
};
