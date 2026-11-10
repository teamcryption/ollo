import { icon, body, line } from '../src/dsl.mjs';
import { R, C, D, E, L, poly } from '../src/geo.mjs';

export default {
  category: 'commerce',
  icons: [
    icon('market-stall', 'Market Stall', ['farmers market', 'stand', 'vendor', 'bazaar', 'booth'], [body('M3.5 4h17v4.5a2.125 2.125 0 0 1-4.25 0 2.125 2.125 0 0 1-4.25 0 2.125 2.125 0 0 1-4.25 0 2.125 2.125 0 0 1-4.25 0Z'), line('M5 10.5v10M19 10.5v10'), body(R(3.5, 14, 17, 3, 1))], { noAccent: true }),
    icon('food-truck', 'Food Truck', ['street food', 'catering', 'truck', 'festival', 'vendor'], [body('M3 16.5V7a1 1 0 0 1 1-1h11l3 4.5a2 2 0 0 1 2 2v4Z'), line(R(5.5, 8.5, 7, 4, 0.6)), body(C(7, 17.5, 2) + C(16.5, 17.5, 2), { cover: true })], { noAccent: true }),
    icon('gumball-machine', 'Gumball Machine', ['candy dispenser', 'bubble gum', 'vending', 'sweets', 'coin'], [body(C(12, 8.5, 5.5)), line(D(10, 7) + D(13.5, 8) + D(11, 10.5)), body(poly([[8, 14], [16, 14], [17, 20.5], [7, 20.5]], 1, true)), line('M10.5 17h3')], { noAccent: true }),
  ],
};
