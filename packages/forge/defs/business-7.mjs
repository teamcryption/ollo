import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, L, D } from '../src/geo.mjs';

export default {
  category: 'business',
  icons: [
    icon('filing-cabinet', 'Filing Cabinet', ['cabinet', 'drawers', 'records', 'archive', 'office'], [body(R(5, 3, 14, 18, 1.5)), line('M5 9h14M5 15h14M10.5 12h3M10.5 18h3'), accent(L(10.5, 6, 13.5, 6))]),
    icon('paper-shredder', 'Paper Shredder', ['shred', 'shredder', 'destroy documents', 'privacy', 'office'], [line('M8 8V3.5h8V8'), body(R(3.5, 8, 17, 6, 1.5)), line('M7 14v6.5M10 14v5M14 14v6.5M17 14v5'), accent(D(17, 11))]),
    icon('swivel-chair', 'Office Chair', ['swivel chair', 'desk chair', 'seat', 'workspace', 'office'], [body(R(7, 3, 10, 8, 2.5)), body(R(5.5, 12, 13, 3, 1.5)), line('M12 15v3.5M7 20.5l5-2 5 2')], { noAccent: true }),
    icon('water-cooler', 'Water Cooler', ['water dispenser', 'drinking water', 'office', 'refill', 'hydration'], [body('M7.5 3.5h9V7c0 1-1 1.5-2 1.5h-1.5V10h-2V8.5H9.5c-1 0-2-.5-2-1.5Z'), body(R(6.5, 10, 11, 10.5, 1.5)), accent(L(10, 13.5, 14, 13.5))]),
    icon('coffee-machine', 'Coffee Machine', ['espresso', 'coffee maker', 'barista', 'kitchen', 'brew'], [body('M5 3.5h14v5h-9v8.5h9v3.5H5Z'), body(R(12, 13, 5, 4, 1)), accent(D(14.5, 10.8))]),
    icon('projector-screen', 'Projector Screen', ['presentation screen', 'meeting', 'slides', 'conference', 'display'], [line('M3 4h18'), body(R(4.5, 4, 15, 11, 1)), line('M12 15v5.5M9 20.5l3-2 3 2')], { noAccent: true }),
  ],
};
