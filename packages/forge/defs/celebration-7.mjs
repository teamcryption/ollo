import { D } from '../src/geo.mjs';
import { icon, line, accent } from '../src/dsl.mjs';

export default {
  category: 'celebration',
  icons: [
    icon('candelabra', 'Candelabra', ['candles', 'candlestick', 'festive', 'holiday', 'light'], [line('M6 8v1.5a6 5 0 0 0 12 0V8M9 8v1.5a3 2.5 0 0 0 6 0V8M12 8v12.5M8.5 20.5h7'), accent(D(6, 5.5) + D(9, 5.5) + D(12, 5.5) + D(15, 5.5) + D(18, 5.5))]),
  ],
};
