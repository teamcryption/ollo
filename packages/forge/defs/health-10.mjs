import { R, C } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'health',
  icons: [
    icon('mri', 'MRI Scanner', ['mri', 'scan', 'radiology', 'imaging', 'hospital'], [body(R(4, 3.5, 16, 13.5, 6.5)), line(C(12, 10.25, 3.3)), line('M3.5 19.5h17M7 19.5v1M17 19.5v1')], { noAccent: true }),
  ],
};
