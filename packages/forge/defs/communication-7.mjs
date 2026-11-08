import { R, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';
import { BUBBLE } from './communication.mjs';

export default {
  category: 'communication',
  icons: [
    icon('pager', 'Pager', ['beeper', 'page', 'on call', 'retro', 'message'], [line('M15 6.5V5h3v1.5'), body(R(3.5, 6.5, 17, 11, 2)), line(R(6, 9, 8.5, 3.5, 0.8)), line(D(17.5, 9.5) + D(17.5, 12.5)), accent('M6.5 15h3.5')]),
    icon('message-quote', 'Message Quote', ['quote', 'testimonial', 'reply', 'citation', 'chat'], [body(BUBBLE), accent('M8.5 8.5h2.5v2.5c0 1.1-.6 1.9-1.8 2.3M13 8.5h2.5v2.5c0 1.1-.6 1.9-1.8 2.3')]),
  ],
};
