import { R, L, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'security',
  icons: [
    icon('otp', 'One-Time Code', ['otp', 'verification code', 'sms code', 'two-step', 'passcode'], [body(R(6.5, 2.5, 11, 19, 3)), line(L(11, 18.5, 13, 18.5)), accent(D(9.5, 11) + D(12, 11) + D(14.5, 11))]),
    icon('phishing', 'Phishing', ['scam', 'fraud', 'email attack', 'hook', 'social engineering'], [body(R(3, 10, 12, 9, 2.5)), line('M6 13l3 2 3-2'), line('M18.5 3.5V13a3 3 0 0 1-6 0v-1')], { noAccent: true }),
  ],
};
