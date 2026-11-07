import { C } from '../src/geo.mjs';
import { icon, body, accent } from '../src/dsl.mjs';
import { SHIELD } from './security.mjs';

export default {
  category: 'security',
  icons: [
    icon('shield-key', 'Shield Key', ['secure access', 'encryption key', 'protected login', 'credential', 'vault key'], [body(SHIELD), accent(C(12, 9.8, 1.6) + 'M12 11.4v4.6M12 14.4h1.6')]),
  ],
};
