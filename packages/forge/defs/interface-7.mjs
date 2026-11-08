import { C, R } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'interface',
  icons: [
    icon('slider-vertical', 'Vertical Slider', ['volume', 'range', 'level', 'control', 'adjust'], [line('M7 3.5v17M17 3.5v17'), body(C(7, 14.5, 2.3), { cover: true }), body(C(17, 8.5, 2.3), { cover: true })], { noAccent: true }),
    icon('stepper', 'Stepper', ['number input', 'increment', 'decrement', 'quantity', 'counter'], [body(R(3, 6.5, 18, 11, 2.5)), line('M9 6.5v11M15 6.5v11M4.8 12h2.4M12 10v4'), accent('M16.9 12h2.2M18 10.9v2.2')]),
  ],
};
