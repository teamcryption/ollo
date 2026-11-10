import { icon, body, line } from '../src/dsl.mjs';
import { C, R } from '../src/geo.mjs';

const CLOCK = [body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')];

export default {
  category: 'finance',
  icons: [
    icon('invoice-clock', 'Invoice Due', ['due date', 'payment due', 'overdue', 'billing', 'pending invoice'], [body(R(4, 3.5, 11.5, 15.5, 2)), line('M7 7.5h5.5M7 10.5h5.5M7 13.5h3'), ...CLOCK], { noAccent: true }),
  ],
};
