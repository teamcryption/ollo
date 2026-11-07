import { R, C, L, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'logistics',
  icons: [
    icon('warehouse', 'Warehouse', ['storage', 'depot', 'inventory', 'stock', 'distribution'], [body('M3.5 20V9l8.5-5 8.5 5v11Z'), line('M7.5 20v-6.5h9V20'), line(L(7.7, 16.8, 16.3, 16.8)), accent(L(10, 9.5, 14, 9.5))]),
    icon('boxes', 'Boxes', ['stock', 'inventory', 'stack', 'parcels', 'shipment'], [body(R(8.5, 3.5, 7, 7, 1.2)), body(R(3.5, 13, 7, 7, 1.2)), body(R(13.5, 13, 7, 7, 1.2)), line(L(12, 3.7, 12, 6)), line(L(7, 13.2, 7, 15.5)), line(L(17, 13.2, 17, 15.5))], { noAccent: true }),
    icon('shipping-container', 'Shipping Container', ['cargo', 'freight', 'container', 'export', 'import'], [body(R(3, 6.5, 18, 11, 1.5)), line(L(7, 9, 7, 15)), line(L(10.5, 9, 10.5, 15)), line(L(14, 9, 14, 15)), accent(L(17.5, 9, 17.5, 15))]),
    icon('hand-truck', 'Hand Truck', ['dolly', 'moving', 'cart', 'delivery', 'carry'], [line('M3.5 4h2.5l3.2 12.5h11.3'), body(R(11, 7.5, 7, 7, 1.2)), accent(C(9.5, 19.8, 1.3))]),
  ],
};
