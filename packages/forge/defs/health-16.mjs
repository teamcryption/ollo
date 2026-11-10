import { icon, body, line } from '../src/dsl.mjs';
import { poly } from '../src/geo.mjs';

export default {
  category: 'health',
  icons: [
    icon('medicine-cup', 'Medicine Cup', ['dose', 'dosage cup', 'syrup', 'measuring cup', 'pharmacy'], [body(poly([[6, 5.5], [18, 5.5], [16.3, 20], [7.7, 20]], 1.2, true)), line('M9 9.5h2.5M9 12.5h3.5M9 15.5h2.5')], { noAccent: true }),
    icon('stomach', 'Stomach', ['digestion', 'gut', 'organ', 'gastro', 'anatomy'], [body('M13 3.5h2.5v3c2.6 1.2 4 3.7 4 6.5 0 4.2-3.4 7.5-7.5 7.5-3.2 0-5.8-1.8-6.8-4.6-.3-.9.6-1.6 1.4-1.1 2.6 1.6 5.4.2 6.1-2.6l.3-1.2V3.5Z')], { noAccent: true }),
    icon('mouth', 'Mouth', ['lips', 'oral health', 'speak', 'kiss', 'smile'], [body('M3.5 12c2.5-3 4.5-4.5 6.5-4.5 1 0 1.5.5 2 1 .5-.5 1-1 2-1 2 0 4 1.5 6.5 4.5-2.5 3.5-5 5-8.5 5s-6-1.5-8.5-5Z'), line('M5.5 12c2 .8 4.2 1.2 6.5 1.2s4.5-.4 6.5-1.2')], { noAccent: true }),
  ],
};
