import { R } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';
import { SHIELD } from './security.mjs';

export default {
  category: 'security',
  icons: [
    icon('shield-lock', 'Shield Lock', ['secure', 'protected', 'privacy', 'encryption', 'safety'], [body(SHIELD), accent('M10.3 11.5V10a1.7 1.7 0 0 1 3.4 0v1.5' + R(9.2, 11.5, 5.6, 4.5, 0.9))]),
  ],
};
