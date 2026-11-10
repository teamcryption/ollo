import { icon, body, line } from '../src/dsl.mjs';
import { R, C, D } from '../src/geo.mjs';

const SH = body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true });
const t = ['protected', 'secure', 'safe', 'security'];

export default {
  category: 'security',
  icons: [
    icon('server-shield', 'Server Security', ['secure server', 'hosting protection', 'ddos', ...t], [body(R(3, 4, 13, 5.5, 1.5)), body(R(3, 11, 13, 5.5, 1.5)), line(D(6, 6.75) + D(6, 13.75)), SH], { noAccent: true }),
    icon('id-shield', 'Identity Protection', ['identity theft', 'id security', 'kyc', ...t], [body(R(3, 5, 15, 11, 2)), line(C(7.5, 9.5, 1.5)), line('M5.3 13.5a2.4 2.4 0 0 1 4.4 0M11.5 9h3.5'), SH], { noAccent: true }),
  ],
};
