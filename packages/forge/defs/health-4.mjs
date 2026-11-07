import { rotateD } from '../src/geo.mjs';
import { icon, body } from '../src/dsl.mjs';

export default {
  category: 'health',
  icons: [
    icon('bone', 'Bone', ['fracture', 'orthopedic', 'skeleton', 'calcium', 'dog treat'], [body(rotateD('M7.5 10.5h9a2.2 2.2 0 1 1 2.6 1.5 2.2 2.2 0 1 1-2.6 1.5h-9a2.2 2.2 0 1 1-2.6-1.5A2.2 2.2 0 1 1 7.5 10.5Z', -45, 12, 12))], { noAccent: true }),
  ],
};
