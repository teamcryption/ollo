import { icon, body, line } from '../src/dsl.mjs';
import { R } from '../src/geo.mjs';

export default {
  category: 'health',
  icons: [
    icon('kidney', 'Kidney', ['renal', 'organ', 'nephrology', 'urology', 'anatomy'], [body('M14 4c3.3 0 5.5 3.5 5.5 8s-2.2 8-5.5 8c-2.6 0-4-2-4-4 0-1.6 1-2.5 1-4s-1-2.4-1-4c0-2.2 1.4-4 4-4Z'), line('M10.8 12H8a2.5 2.5 0 0 0-2.5 2.5V20.5')], { noAccent: true }),
  ],
};
