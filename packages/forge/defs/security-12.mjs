import { icon, body, line } from '../src/dsl.mjs';
import { R, poly, scaleD, translateD } from '../src/geo.mjs';

// Small shield in front, bottom right: "protected X".
const SH = body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true });
const HEART = 'M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z';
const t = ['protected', 'secure', 'insurance', 'safe'];

export default {
  category: 'security',
  icons: [
    icon('cloud-shield', 'Cloud Security', ['cloud protection', 'secure cloud', ...t], [body('M6.5 15a3.5 3.5 0 0 1-.4-7 5 5 0 0 1 9.6 1.1A3 3 0 0 1 15.5 15Z'), SH], { noAccent: true }),
    icon('smartphone-shield', 'Phone Protection', ['mobile security', 'device protection', ...t], [body(R(4, 3, 9.5, 17, 2.5)), line('M7.5 5.5h2.5'), SH], { noAccent: true }),
    icon('card-shield', 'Payment Protection', ['secure payment', 'fraud protection', 'card security', ...t], [body(R(3, 5, 15, 10, 2)), line('M3.2 8.5h14.6'), SH], { noAccent: true }),
    icon('home-shield', 'Home Insurance', ['home security', 'property cover', 'house protection', ...t], [body(poly([[3, 10.5], [9.5, 4.5], [16, 10.5], [16, 18], [3, 18]], 1, true)), SH], { noAccent: true }),
    icon('laptop-shield', 'Device Security', ['laptop protection', 'endpoint', 'antivirus', ...t], [body(R(5, 5, 12, 8.5, 1.5)), line('M3 16h11'), SH], { noAccent: true }),
    icon('heart-shield', 'Health Insurance', ['health cover', 'medical insurance', 'care plan', ...t], [body(translateD(scaleD(HEART, 0.7), -2.5, -2)), SH], { noAccent: true }),
    icon('package-shield', 'Shipping Insurance', ['parcel protection', 'insured delivery', 'safe shipping', ...t], [body(R(3.5, 5, 12, 12, 2)), line('M9.5 5.2v3.5'), SH], { noAccent: true }),
    icon('wallet-shield', 'Secure Wallet', ['wallet protection', 'safe money', 'fraud guard', ...t], [body(R(3, 6, 14, 11, 2.5)), line('M16.8 9.5h-3.3a1.75 1.75 0 0 0 0 3.5h3.3'), SH], { noAccent: true }),
  ],
};
