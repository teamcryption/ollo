import { R, C, L, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'home',
  icons: [
    icon('sofa', 'Sofa', ['couch', 'living room', 'furniture', 'lounge', 'seat'], [line('M5.5 11V8.5A2.5 2.5 0 0 1 8 6h8a2.5 2.5 0 0 1 2.5 2.5V11'), body(R(3, 11, 18, 6, 2)), line(L(5.5, 17.2, 5.5, 19)), line(L(18.5, 17.2, 18.5, 19)), accent(L(8.5, 14, 15.5, 14))]),
    icon('lamp', 'Lamp', ['light', 'lighting', 'desk lamp', 'interior'], [body(poly([[8, 4], [16, 4], [18.5, 11], [5.5, 11]], 0.8, true)), line(L(12, 11, 12, 19)), line(L(8.5, 19.5, 15.5, 19.5)), accent(L(16, 13, 16, 15))], { off: true }),
    icon('door', 'Door', ['entrance', 'exit', 'room', 'enter'], [body(R(6.5, 3.5, 11, 17, 1.5)), line(L(4, 20.5, 20, 20.5)), accent(D(14.5, 12.5))]),
    icon('washing-machine', 'Washing Machine', ['laundry', 'washer', 'appliance', 'clothes'], [body(R(4.5, 3, 15, 18, 2.5)), line(L(4.7, 7.5, 19.3, 7.5)), line(C(12, 14, 4)), line(L(13, 5.3, 16, 5.3)), accent(D(8, 5.3))], { anim: 'spin' }),
    icon('fridge', 'Fridge', ['refrigerator', 'kitchen', 'appliance', 'cold'], [body(R(5.5, 3, 13, 18, 2.5)), line(L(5.7, 9.5, 18.3, 9.5)), line(L(8.5, 5.5, 8.5, 7.5)), accent(L(8.5, 12, 8.5, 15))]),
    icon('bathtub', 'Bathtub', ['bath', 'bathroom', 'tub', 'wash'], [body('M4.5 12h15v3a4 4 0 0 1-4 4h-7a4 4 0 0 1-4-4Z'), line('M6 12V6a2 2 0 0 1 3.7-1'), line(L(7, 19, 6, 20.5)), line(L(17, 19, 18, 20.5)), accent(C(14.5, 8, 1.3))]),
    icon('air-conditioner', 'Air Conditioner', ['ac', 'cooling', 'climate', 'hvac', 'air'], [body(R(3, 5, 18, 8, 2)), line(L(6, 10, 18, 10)), line(L(8, 16, 8, 18)), line(L(12, 16, 12, 19)), accent(L(16, 16, 16, 18))], { off: true }),
    icon('faucet', 'Faucet', ['tap', 'water', 'sink', 'plumbing'], [line('M4 10h7a3 3 0 0 1 3 3v1'), line(L(8, 10, 8, 7)), line(L(5.5, 7, 10.5, 7)), accent('M14 17.5c.6.9 1 1.5 1 2a1 1 0 0 1-2 0c0-.5.4-1.1 1-2Z')], { anim: 'pulse' }),
  ],
};
