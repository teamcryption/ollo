import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const SHIELD = 'M12 3.4l6.5 2.4a1 1 0 0 1 .6.9v4.8c0 4.3-2.9 7.6-7.1 9.1-4.2-1.5-7.1-4.8-7.1-9.1V6.7a1 1 0 0 1 .6-.9Z';
const CORNERS = [line('M4 8.5V6.5A2.5 2.5 0 0 1 6.5 4h2'), line('M15.5 4h2A2.5 2.5 0 0 1 20 6.5v2'), line('M20 15.5v2a2.5 2.5 0 0 1-2.5 2.5h-2'), line('M8.5 20h-2A2.5 2.5 0 0 1 4 17.5v-2')];

export default {
  category: 'security',
  icons: [
    // Closed padlock. The open one is the Figma `lock-open` (same body, shackle lifted).
    icon('lock', 'Lock', ['padlock', 'locked', 'secure', 'private', 'password'], [line('M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5'), body(R(5.5, 10.5, 13, 9.5, 3)), accent(L(12, 14.5, 12, 16))], { anim: 'wiggle', badges: ['check', 'alert'], siblings: ['lock-open'] }),
    icon('shield', 'Shield', ['protection', 'security', 'safe', 'guard', 'defence'], [body(SHIELD), accent(A(12, 11.5, 3.6, 200, 270))], {
      anim: 'pulse',
      variants: [
        { name: 'shield-check', title: 'Shield Check', tags: ['verified', 'secure', 'protected', 'trusted'], els: [body(SHIELD), accent(poly([[9, 11.6], [11.2, 13.8], [15, 9.8]], 0.6))] },
        { name: 'shield-alert', title: 'Shield Alert', tags: ['threat', 'warning', 'vulnerable', 'risk'], els: [body(SHIELD), accent(L(12, 8.2, 12, 12.2)), line(D(12, 15))] },
        { name: 'shield-off', title: 'Shield Off', tags: ['unprotected', 'disabled', 'insecure'], els: [body(SHIELD), line(L(4.5, 4.5, 19.5, 19.5), { cover: true })], noAccent: true },
      ],
    }),
    icon('key', 'Key', ['password', 'access', 'unlock', 'credential', 'login'], [body(C(8, 15.5, 4)), accent(C(8, 15.5, 1.2)), line(L(10.9, 12.6, 19.5, 4)), line(L(16.6, 6.9, 18.8, 9.1)), line(L(14.2, 9.3, 15.8, 10.9))], { anim: 'wiggle' }),
    icon('eye-scan', 'Eye Scan', ['face id', 'biometric', 'iris', 'recognition', 'verify'], [...CORNERS, body('M7 12c1.3-2.4 3-3.5 5-3.5s3.7 1.1 5 3.5c-1.3 2.4-3 3.5-5 3.5S8.3 14.4 7 12Z'), accent(D(12, 12))], { anim: 'pulse' }),
    icon('qr-scan', 'QR Scan', ['qr code', 'scan', 'barcode', 'camera', 'code'], [...CORNERS, body(R(7.5, 7.5, 3.5, 3.5, 0.8)), body(R(13, 7.5, 3.5, 3.5, 0.8)), body(R(7.5, 13, 3.5, 3.5, 0.8)), accent(D(14.7, 14.7))]),
    icon('password', 'Password', ['pin', 'passcode', 'secret', 'login', 'field'], [body(R(2.5, 7, 19, 10, 3)), line(D(7, 12)), line(D(10.3, 12)), line(D(13.6, 12)), accent(L(17.3, 10, 17.3, 14))]),
    icon('safe', 'Safe', ['vault', 'deposit', 'money', 'secure', 'storage'], [body(R(3.5, 4, 17, 14.5, 2.5)), line(C(11, 11.2, 3.4)), accent(D(11, 11.2)), line(L(17, 9, 17, 13.5)), line(L(7, 18.7, 7, 20.5)), line(L(17, 18.7, 17, 20.5))]),
    icon('fingerprint', 'Fingerprint', ['biometric', 'touch id', 'identity', 'scan'], [line(A(12, 12.5, 8, 200, 340)), line('M7.2 19a8 8 0 0 1-1.2-4.3V13a6 6 0 0 1 12 0v1.2'), line('M10.4 20.3a9 9 0 0 1-1.4-5V13a3 3 0 0 1 6 0v2.3'), accent(L(12, 13, 12, 16.5)), line('M17.8 17.4c-.3 1.2-.8 2.2-1.4 3')], { noAccent: false }),
  ],
};
