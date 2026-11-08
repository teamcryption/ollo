import { L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'energy',
  icons: [
    icon('lightbulb-eco', 'Eco Lightbulb', ['energy saving', 'green', 'sustainable', 'led', 'eco'], [body('M9.2 16.5v-1.3c0-.9-.5-1.6-1.2-2.3a5.6 5.6 0 1 1 8 0c-.7.7-1.2 1.4-1.2 2.3v1.3Z'), line(L(9.5, 19.5, 14.5, 19.5)), accent('M10.3 12.3c0-2.4 1.4-3.9 3.9-4.3 0 2.4-1.4 3.9-3.9 4.3Z')]),
  ],
};
