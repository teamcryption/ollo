import { L } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'notifications',
  icons: [
    // The Figma bell is the base; only its variants are drawn here.
    icon('bell', 'Bell', ['notification', 'alert', 'reminder', 'alarm'], [body('M6.5 15.5V11a5.5 5.5 0 0 1 11 0v4.5l1.1 1.3c.4.5.1 1.2-.6 1.2H6c-.7 0-1-.7-.6-1.2Z'), line(L(10.5, 20.2, 13.5, 20.2)), line(L(12, 3.5, 12, 4.2))], { extend: true, badges: ['check', 'close'] }),
  ],
};
