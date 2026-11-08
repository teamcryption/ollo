import { icon, body, line } from '../src/dsl.mjs';


export default {
  category: 'buildings',
  icons: [
    icon('church', 'Church', ['chapel', 'worship', 'religion', 'wedding', 'steeple'], [line('M12 3v4.5M10.5 4.5h3'), body('M6 20.5V12l6-4.5 6 4.5v8.5Z'), line('M10.5 20.5v-3a1.5 1.5 0 0 1 3 0v3')], { noAccent: true }),
  ],
};
