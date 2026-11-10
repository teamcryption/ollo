import { icon, body, line } from '../src/dsl.mjs';
import { R, poly } from '../src/geo.mjs';

// Small bolt in front, bottom right: "instant / express X".
const BOLT = [body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })];
const t = ['instant', 'fast', 'express', 'quick'];

export default {
  category: 'interface',
  icons: [
    icon('card-bolt', 'Instant Payment', ['instant transfer', 'fast pay', 'quick checkout', ...t], [body(R(3, 5, 15, 10, 2)), line('M3.2 8.5h14.6'), ...BOLT], { noAccent: true }),
    icon('parcel-bolt', 'Express Delivery', ['same day', 'next day', 'priority shipping', ...t], [body(R(3, 4, 12.5, 12, 2)), line('M9.25 4.2v3.5'), ...BOLT], { noAccent: true }),
    icon('message-bolt', 'Quick Reply', ['canned response', 'fast reply', 'shortcut message', ...t], [body('M5.5 4h9A2.5 2.5 0 0 1 17 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3A2.5 2.5 0 0 1 3 10.5v-4A2.5 2.5 0 0 1 5.5 4Z'), ...BOLT], { noAccent: true }),
    icon('home-bolt', 'Home Energy', ['home power', 'electricity', 'energy use', 'smart meter', 'utilities'], [body(poly([[3, 10.5], [9.5, 4.5], [16, 10.5], [16, 18.5], [3, 18.5]], 1, true)), ...BOLT], { noAccent: true }),
  ],
};
