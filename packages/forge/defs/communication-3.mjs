import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';
import { BUBBLE } from './communication.mjs';

export default {
  category: 'communication',
  icons: [
    icon('message-image', 'Image Message', ['photo message', 'mms', 'picture', 'send photo'], [body(BUBBLE), line(poly([[7, 14.5], [10, 11], [12, 13], [13.5, 11.8], [17, 14.5]], 0.5)), accent(C(15, 8.3, 1.2))]),
    icon('mailbox', 'Mailbox', ['postbox', 'letterbox', 'post', 'mail'], [body('M8 6.5h8a4.5 4.5 0 0 1 4.5 4.5v5h-17v-5A4.5 4.5 0 0 1 8 6.5Z'), line('M8 6.7a4.5 4.5 0 0 1 4.5 4.5v4.6'), line(L(12, 16.2, 12, 20.5)), accent('M15.5 13V9.5H18')]),
    icon('newsletter', 'Newsletter', ['bulletin', 'digest', 'subscribe', 'email campaign'], [body(R(4, 3.5, 16, 17, 2.5)), line(R(7, 7, 10, 4, 1)), line(L(7, 14.5, 17, 14.5)), accent(L(7, 17.5, 12, 17.5))]),
    icon('fax', 'Fax', ['fax machine', 'facsimile', 'office', 'send document'], [line('M7 9V3.5h7l3 3V9'), body(R(3.5, 9, 17, 11, 2)), line(R(6, 12, 5, 5, 1)), line(D(14, 13)), line(D(17, 13)), line(D(14, 16)), accent(D(17, 16))]),
    icon('satellite-dish', 'Satellite Dish', ['antenna', 'signal', 'broadcast', 'receiver'], [body('M5 8.5a10.5 10.5 0 0 0 10.5 10.5Z'), line(L(10.2, 13.8, 15, 9)), line(L(8.5, 16, 6, 20.5)), line(L(4, 20.5, 9.5, 20.5)), accent(A(14, 10, 4.5, -80, -10)), line(A(14, 10, 7, -75, -15))]),
  ],
};
