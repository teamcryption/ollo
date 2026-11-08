import { L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';
import { PAGE, FOLD } from './files.mjs';

export default {
  category: 'files',
  icons: [
    icon('file-log', 'Log File', ['log', 'logs', 'events', 'history', 'output'], [body(PAGE), line(FOLD), line('M8.5 12h1M11.5 12h4M8.5 15h1M11.5 15h4'), accent(L(8.5, 18, 13, 18))]),
  ],
};
