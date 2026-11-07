import { R } from '../src/geo.mjs';
import { icon, body, accent } from '../src/dsl.mjs';

export default {
  category: 'navigation',
  icons: [
    icon('one-way', 'One Way', ['one way street', 'direction sign', 'traffic sign', 'road sign'], [body(R(3, 7.5, 18, 9, 2)), accent('M7 12h9M13.5 9.5 16 12l-2.5 2.5')]),
  ],
};
