import { icon, body, line } from '../src/dsl.mjs';
import { C, R, rotateD } from '../src/geo.mjs';

const CLOCK = [body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')];

export default {
  category: 'health',
  icons: [
    icon('pill-clock', 'Medication Reminder', ['dose time', 'pill reminder', 'medication schedule', 'take medicine', 'pharmacy'], [body(rotateD(R(7, 2.5, 5, 13, 2.5), 45, 9.5, 9)), line(rotateD('M7.2 9h4.6', 45, 9.5, 9)), ...CLOCK], { noAccent: true }),
  ],
};
