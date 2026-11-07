import { R, E } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'education',
  icons: [
    icon('diploma', 'Diploma', ['degree', 'graduation scroll', 'certificate', 'qualification', 'scroll'], [body(R(3.5, 7, 17, 7, 3.5)), line(E(6.5, 10.5, 1.2, 3.3)), line('M13.5 14.2v6l2-1.5 2 1.5v-6')], { noAccent: true }),
  ],
};
