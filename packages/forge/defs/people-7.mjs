import { rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const HAND = 'M8 13.5V6.5a1.25 1.25 0 0 1 2.5 0V5a1.25 1.25 0 0 1 2.5 0v.8a1.25 1.25 0 0 1 2.5 0V8a1.25 1.25 0 0 1 2.5 0v6.5c0 3.6-2.4 6-5.5 6-2.4 0-4-1.2-5.2-3L5 13.8a1.3 1.3 0 0 1 2-1.6Z';
const GAPS = 'M10.5 6.5V11M13 5.8V11M15.5 8v3.5';

export default {
  category: 'people',
  icons: [
    icon('hand-raised', 'Hand Raised', ['raise hand', 'question', 'volunteer', 'palm', 'stop'], [body(HAND), line(GAPS)], { noAccent: true }),
    icon('hand-wave', 'Hand Wave', ['hello', 'hi', 'greeting', 'goodbye', 'wave'], [body(rotateD(HAND, -15, 12, 14)), line(rotateD(GAPS, -15, 12, 14)), accent('M18.3 3.5c1.2.6 2 1.6 2.4 2.9M3.5 17.5c.4 1.3 1.2 2.3 2.4 2.9')]),
  ],
};
