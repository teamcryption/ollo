import { R, C, L, A, poly, D, rotateD, scaleD, translateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';
import { SHIELD } from './security.mjs';

export default {
  category: 'security',
  icons: [
    icon('cctv', 'CCTV', ['security camera', 'surveillance', 'monitoring', 'camera'], [body(rotateD(R(4, 5, 12, 6, 1.5), 15, 10, 8)), line('M15.5 12.3l1.3 3.2h3.7'), line(L(20.5, 12.5, 20.5, 18.5)), accent(D(7, 7.3))]),
    icon('smart-lock', 'Smart Lock', ['door lock', 'keypad', 'access', 'smart home'], [body(R(7, 3, 10, 18, 3)), line(C(12, 8.5, 2)), line(D(10, 13.5)), line(D(14, 13.5)), line(D(10, 17)), accent(D(14, 17))]),
    icon('two-factor', 'Two-Factor', ['2fa', 'mfa', 'verification', 'authenticator', 'otp'], [body(R(4, 3, 10, 18, 2.5)), accent(L(7.5, 6, 10.5, 6)), body(translateD(scaleD(SHIELD, 0.5), 5, 3.5), { cover: true }), line(poly([[15.4, 15.2], [16.5, 16.3], [18.5, 14.2]], 0.3))]),
    icon('keyhole', 'Keyhole', ['lock', 'access', 'private', 'secure'], [body(C(12, 12, 8.5)), accent('M12 7.5a2 2 0 0 1 1 3.7l.8 5.3h-3.6l.8-5.3A2 2 0 0 1 12 7.5Z')]),
    icon('combination-lock', 'Combination Lock', ['padlock', 'code', 'dial', 'locker'], [line('M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10'), body(C(12, 15, 6), { cover: true }), line(C(12, 15, 2.6)), accent(D(12, 15))]),
    icon('shield-user', 'Protected User', ['account security', 'identity protection', 'privacy', 'guard'], [body(SHIELD), line(C(12, 9.3, 1.8)), line('M8.8 15.3a3.2 3.2 0 0 1 6.4 0')], { noAccent: true }),
  ],
};
