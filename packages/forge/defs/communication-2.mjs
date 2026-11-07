import { R, C, L, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';
import { HANDSET, BUBBLE } from './communication.mjs';

export default {
  category: 'communication',
  icons: [
    icon('phone-incoming', 'Incoming Call', ['call', 'receive', 'incoming', 'ring'], [body(HANDSET), accent('M19.5 4.5 15 9M15 5.5V9h3.5')], { anim: 'wiggle', variants: [{ name: 'phone-outgoing', title: 'Outgoing Call', tags: ['call', 'dial', 'outgoing', 'ring'], els: [body(HANDSET), accent('M15 9l4.5-4.5M16 4.5h3.5V8')] }, { name: 'phone-missed', title: 'Missed Call', tags: ['call', 'missed', 'unanswered', 'ring'], els: [body(HANDSET), accent('M14.5 5l2.5 2.5L20 4.5')] }] }),
    icon('message-question', 'Message Question', ['help', 'faq', 'support', 'ask', 'chat'], [body(BUBBLE), line('M10.3 9.3a1.8 1.8 0 1 1 2.5 1.6c-.5.3-.8.7-.8 1.3'), accent(D(12, 14.3))]),
    icon('walkie-talkie', 'Walkie Talkie', ['radio', 'two-way', 'transceiver', 'talk'], [body(R(7, 7, 10, 14, 2)), line(L(9, 7, 9, 3)), line(L(9.5, 10.5, 14.5, 10.5)), line(L(9.5, 13, 14.5, 13)), accent(D(12, 17))]),
  ],
};
