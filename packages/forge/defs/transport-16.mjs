import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C } from '../src/geo.mjs';

const W = (a, b, r = 2, y = 17.5) => body(C(a, y, r) + C(b, y, r), { cover: true });

export default {
  category: 'transport',
  icons: [
    icon('pickup-truck', 'Pickup Truck', ['pickup', 'truck', 'ute', 'haul', 'vehicle'], [body('M3 16.5v-4a1 1 0 0 1 1-1h7V8a1.5 1.5 0 0 1 1.5-1.5H16l3.2 4.5a2 2 0 0 1 1.8 2v3.5Z'), line('M12.8 9v2.5h4.5'), W(7, 16.5)], { noAccent: true }),
    icon('convertible', 'Convertible', ['cabriolet', 'sports car', 'roadster', 'open top', 'car'], [line('M13.5 10.5 12 7'), body('M3 16.5v-3a2 2 0 0 1 2-2h4.5l1.5-1h4.5l4 2.2a2.5 2.5 0 0 1 1.5 2.3v1.5Z'), W(7, 17)], { noAccent: true }),
    icon('golf-cart', 'Golf Cart', ['buggy', 'golf', 'resort', 'electric cart', 'course'], [line('M5 5h12M6 5v7M16 5v6.5'), body('M3.5 16.5V13a1 1 0 0 1 1-1h11.5l3 2v2.5Z'), W(7, 16.5)], { noAccent: true }),
    icon('go-kart', 'Go-Kart', ['karting', 'racing', 'kart', 'track', 'motorsport'], [body(C(10, 8.5, 2)), line('M13 13l2-3'), body('M3.5 16h17v-2l-4-1H9l-2-2H4.5Z'), W(6, 17.5, 2.2, 17.5)], { noAccent: true }),
    icon('atv', 'ATV', ['quad bike', 'four wheeler', 'off road', 'all terrain', 'trail'], [line('M15 12l1-3h2.5'), body('M5 12h14l1.5 2H3.5Z'), W(6.5, 17.5, 3, 16.5)], { noAccent: true }),
    icon('snowmobile', 'Snowmobile', ['snow', 'skidoo', 'winter', 'sled', 'arctic'], [line('M15.5 10.5l1-3h2'), body('M5 16.5l2-4h6l2-2h3l2.5 4v2Z'), line('M3.5 19.5h11a2.5 2.5 0 0 0 2.5-2.5M16.5 19.5h2c1.2 0 2-.8 2-2')], { noAccent: true }),
    icon('garbage-truck', 'Garbage Truck', ['refuse truck', 'bin lorry', 'waste', 'trash pickup', 'sanitation'], [body('M3 16.5 4.5 6.5H14v10Z'), line('M5 10h9M4.5 13h9.5'), body('M15 9.5h2.5a1.5 1.5 0 0 1 1.3.8l1.5 3a1.5 1.5 0 0 1 .2.7v2.5H15Z'), W(7, 17)], { noAccent: true }),
    icon('tanker-truck', 'Tanker Truck', ['tank truck', 'fuel truck', 'oil', 'gas delivery', 'hauler'], [body(R(3, 7.5, 11, 6.5, 3.25)), line('M3 15.5h11'), body('M15 9.5h2.5a1.5 1.5 0 0 1 1.3.8l1.5 3a1.5 1.5 0 0 1 .2.7v2.5H15Z'), W(7, 17)], { noAccent: true }),
  ],
};
