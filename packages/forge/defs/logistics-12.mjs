import { icon, body, line } from '../src/dsl.mjs';
import { R, C } from '../src/geo.mjs';

export default {
  category: 'logistics',
  icons: [
    icon('shipping-crate', 'Shipping Crate', ['wooden crate', 'freight', 'cargo', 'export', 'pallet box'], [body(R(4, 5, 16, 14, 1.5)), line('M4.2 8.5h15.6M4.2 15.5h15.6M7 8.5l10 7')], { noAccent: true }),
    icon('tape-roll', 'Packing Tape', ['tape', 'parcel tape', 'packing', 'seal box', 'adhesive'], [body(C(10, 11, 6.5)), line(C(10, 11, 2.5)), body('M15 15.5 20.5 18v2.5L13.5 17Z', { cover: true })], { noAccent: true }),
  ],
};
