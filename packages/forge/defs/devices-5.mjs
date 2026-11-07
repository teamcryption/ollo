import { R, L, poly } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'devices',
  icons: [
    icon('printer-3d', '3D Printer', ['3d printing', 'additive', 'maker', 'fabrication', 'filament'], [body(R(3.5, 3.5, 17, 3, 1)), line(L(5, 6.7, 5, 20.5)), line(L(19, 6.7, 19, 20.5)), line(L(3.5, 20.5, 20.5, 20.5)), body(poly([[10.5, 8.5], [13.5, 8.5], [12, 11]], 0.3, true)), accent(R(9.5, 14.5, 5, 4, 1))]),
    icon('cable', 'Cable', ['usb cable', 'cord', 'connector', 'wire', 'charging cable'], [body(R(9, 4, 6, 6.5, 1.5)), accent('M11 6.2v1.5M13 6.2v1.5'), line('M12 10.5v3.5a3 3 0 0 1-3 3H8a2.5 2.5 0 0 0-2.5 2.5v1')]),
  ],
};
