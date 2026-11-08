import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'media',
  icons: [
    icon('trumpet', 'Trumpet', ['brass', 'jazz', 'music', 'instrument', 'fanfare'], [line('M3.5 10.5v3M3.5 12h10M6 12v3.5a1.5 1.5 0 0 0 1.5 1.5H12a1.5 1.5 0 0 0 1.5-1.5V12M7.5 12V8.5M10 12V8.5M12.5 12V8.5'), body('M13.5 10l7-3.5v11l-7-3.5Z')], { noAccent: true }),
  ],
};
