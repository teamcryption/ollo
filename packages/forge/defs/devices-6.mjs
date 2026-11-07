import { R, C, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'devices',
  icons: [
    icon('trackpad', 'Trackpad', ['touchpad', 'gesture', 'pointer', 'laptop pad', 'swipe'], [body(R(4, 4.5, 16, 15, 2.5)), line(L(4.2, 15.5, 19.8, 15.5)), line(L(12, 15.7, 12, 19.3)), accent(C(12, 10, 1.3))]),
    icon('usb-c-port', 'USB-C Port', ['usb c', 'port', 'connector', 'charging port', 'type c'], [line(R(4, 9, 16, 6, 3)), accent(L(8, 12, 16, 12))]),
  ],
};
