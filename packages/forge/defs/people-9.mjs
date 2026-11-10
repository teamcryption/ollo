import { icon, body, line } from '../src/dsl.mjs';
import { R, C, poly, translateD } from '../src/geo.mjs';

const SH = 'M5.5 19c.4-2.7 3.1-4.5 6.5-4.5s6.1 1.8 6.5 4.5c.1.6-.4 1-.9 1H6.4c-.5 0-1-.4-.9-1Z';

export default {
  category: 'people',
  icons: [
    icon('student', 'Student', ['pupil', 'graduate', 'learner', 'scholar', 'education'], [body(C(12, 10.5, 2.8)), body(poly([[12, 3.5], [19, 6.8], [12, 10], [5, 6.8]], 0.8, true), { cover: true }), line('M17.5 7.5v3.5'), body(translateD(SH, 0, 0.7))], { noAccent: true }),
    icon('user-edit', 'Edit Profile', ['edit user', 'update profile', 'account settings', 'modify person', 'pencil'], [body(C(9.5, 8, 3.5)), body(translateD(SH, -2.5, 0)), body(poly([[18, 11], [20.5, 13.5], [14.5, 19.5], [11.95, 19.55], [12, 17]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('user-pin', 'User Location', ['person location', 'where am i', 'member nearby', 'check in', 'locate user'], [body(C(9.5, 8, 3.5)), body(translateD(SH, -2.5, 0)), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
  ],
};
