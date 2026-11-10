import { icon, body, line } from '../src/dsl.mjs';
import { R } from '../src/geo.mjs';

export default {
  category: 'accessibility',
  icons: [
    icon('text-to-speech', 'Text to Speech', ['read aloud', 'screen reader', 'tts', 'narrate', 'voice'], [body(R(3.5, 4, 11, 16, 2)), line('M6.5 8.5h5M6.5 11.5h5M6.5 14.5h3'), line('M17 10a2.5 2.5 0 0 1 0 4M19 8.3a5 5 0 0 1 0 7.4')], { noAccent: true }),
    icon('focus-ring', 'Focus Ring', ['keyboard focus', 'focus state', 'outline', 'tab focus', 'a11y'], [body(R(6.5, 8.5, 11, 7, 2.5)), line(R(3.5, 5.5, 17, 13, 4.5))], { noAccent: true }),
  ],
};
