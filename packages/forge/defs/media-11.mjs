import { poly } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'media',
  icons: [
    icon('audiobook', 'Audiobook', ['listen', 'book', 'audio', 'story', 'narration'], [body('M5 4.5h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5Z'), line('M8 4.5v16'), accent(poly([[11, 9.5], [15, 12.5], [11, 15.5]], 0.5, true))]),
  ],
};
