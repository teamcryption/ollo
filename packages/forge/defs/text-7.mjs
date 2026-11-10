import { icon, body, line } from '../src/dsl.mjs';
import { R } from '../src/geo.mjs';

export default {
  category: 'text',
  icons: [
    icon('clear-format', 'Clear Formatting', ['remove style', 'plain text', 'reset format', 'unformat', 'text'], [line('M4.5 5h11M10 5v14'), line('M14.5 13.5l5.5 5.5M20 13.5 14.5 19')], { noAccent: true }),
  ],
};
