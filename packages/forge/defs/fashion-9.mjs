import { C, L, R, D, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const pin = (d) => rotateD(d, -40);

export default {
  category: 'fashion',
  icons: [
    icon('safety-pin', 'Safety Pin', ['pin', 'fasten', 'sewing', 'nappy', 'clip'], [line(pin(C(5.5, 12, 2.5))), line(pin(L(5.5, 9.5, 16, 9.5))), line(pin(L(7.6, 13.4, 16, 12.4))), body(pin(R(15, 8, 5.5, 5.5, 1.8)), { cover: true })], { noAccent: true }),
    icon('thimble', 'Thimble', ['sewing', 'needle', 'finger', 'craft', 'tailor'], [body('M7 19V11a5 5 0 0 1 10 0v8Z'), body(R(5.5, 18, 13, 2.5, 1.2), { cover: true }), accent([9.5, 12, 14.5].flatMap((x) => [10.5, 13, 15.5].map((y) => D(x, y))).join(''))]),
  ],
};
