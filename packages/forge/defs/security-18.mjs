import { icon, body, line } from '../src/dsl.mjs';
import { R, C } from '../src/geo.mjs';

const LOCK = [line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })];
const SH = body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true });
const TICKET = [body('M3 7.5A1.5 1.5 0 0 1 4.5 6h10A1.5 1.5 0 0 1 16 7.5V9a1.5 1.5 0 0 0 0 3v1.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 13.5V12a1.5 1.5 0 0 0 0-3Z'), line('M11 6.5v1.5M11 10v1M11 13v1.5')];

export default {
  category: 'security',
  icons: [
    icon('ticket-shield', 'Ticket Protection', ['refundable ticket', 'event insurance', 'protected booking', 'guarantee', 'secure'], [...TICKET, SH], { noAccent: true }),
    icon('user-lock', 'Account Locked', ['locked account', 'suspended user', 'restricted', 'private profile', 'security'], [body(C(9, 7.5, 3.3)), body('M3 18.5c.4-2.6 2.9-4.3 6-4.3 1.4 0 2.6.3 3.6.9-1 1-1.6 2.4-1.6 3.9v.5H3.8c-.5 0-.9-.5-.8-1Z'), ...LOCK], { noAccent: true }),
    icon('location-lock', 'Location Private', ['hide location', 'location off', 'privacy', 'private place', 'secure'], [body('M9.5 18.5s-6-5.2-6-9.6a6 6 0 0 1 12 0c0 1.1-.4 2.3-1 3.4'), line(C(9.5, 8.9, 2)), ...LOCK], { noAccent: true }),
    icon('book-lock', 'Diary', ['private journal', 'locked book', 'secret diary', 'personal notes', 'private'], [body(R(3, 4, 11, 15, 2)), line('M6 4.2v14.6'), ...LOCK], { noAccent: true }),
  ],
};
