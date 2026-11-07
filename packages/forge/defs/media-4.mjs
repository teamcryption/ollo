import { R, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const BARS = [3, 8, 13, 6, 15, 9, 4];

export default {
  category: 'media',
  icons: [
    icon('subtitles', 'Subtitles', ['captions', 'closed captions', 'cc', 'transcript', 'text track'], [body(R(3.5, 5, 17, 14, 2.5)), line('M7 12.5h5M7 15.5h3M12 15.5h5'), accent('M14.5 12.5H17')]),
    icon('sound-wave', 'Sound Wave', ['waveform', 'audio', 'voice', 'frequency', 'recording'], BARS.map((h, i) => (i === 4 ? accent : line)(L(4.5 + i * 2.5, 12 - h / 2, 4.5 + i * 2.5, 12 + h / 2))), { anim: 'pulse' }),
  ],
};
