import { C } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'security',
  icons: [
    icon('passkey', 'Passkey', ['passwordless', 'sign in', 'credential', 'login key', 'webauthn'], [body(C(8.5, 7.5, 3.2)), body('M3.5 19.5a5.5 5.5 0 0 1 9-4.2V19.5Z'), line(C(17, 10.5, 2.2)), line('M17 12.7v6.8M17 16.5h2M17 19h1.5')], { noAccent: true }),
  ],
};
