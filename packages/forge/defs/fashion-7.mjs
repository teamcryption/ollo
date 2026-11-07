import { C, L, D, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'fashion',
  icons: [
    icon('button', 'Button', ['sewing', 'clothing', 'fastener', 'craft', 'tailor'], [body(C(12, 12, 8.5)), line(C(12, 12, 6)), accent(D(10.3, 10.3) + D(13.7, 10.3) + D(10.3, 13.7) + D(13.7, 13.7))]),
    icon('needle-thread', 'Needle and Thread', ['sewing', 'stitch', 'tailor', 'craft', 'mend'], [body(rotateD('M12 3.5c.9 0 1.4.7 1.4 1.6V17L12 20.5 10.6 17V5.1c0-.9.5-1.6 1.4-1.6Z', 45)), line(rotateD(L(12, 5.4, 12, 7.4), 45)), line('M16.2 7.8c3 1 4.5 4 3.5 7s-4 4.5-7 5')], { noAccent: true }),
  ],
};
