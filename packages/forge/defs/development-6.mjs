import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, poly } from '../src/geo.mjs';

export default {
  category: 'development',
  icons: [
    icon('circuit-board', 'Circuit Board', ['pcb', 'electronics', 'hardware', 'traces', 'motherboard'], [body(R(3.5, 3.5, 17, 17, 2.5)), line('M7 7.5h4l2.5 2.5V17M7 12h3M7 16.5h3'), accent(C(16.5, 7.5, 1.2))]),
    icon('resistor', 'Resistor', ['electronics', 'component', 'ohm', 'circuit', 'resistance'], [line('M3 12h4M17 12h4'), body(R(7, 8, 10, 8, 3.5)), line('M10.5 8.2v7.6M13.5 8.2v7.6')], { noAccent: true }),
    icon('capacitor', 'Capacitor', ['electronics', 'component', 'farad', 'circuit', 'electrolytic'], [body(R(7.5, 3.5, 9, 12, 2)), line('M10 15.5v5M14 15.5v3.5M13.8 3.7v11.6'), accent('M9.5 8h2M10.5 7v2')]),
    icon('diode', 'Diode', ['electronics', 'rectifier', 'circuit', 'component', 'symbol'], [line('M3 12h5M16 12h5'), body(poly([[8, 7], [8, 17], [15, 12]], 0.8, true)), line('M16 7v10')], { noAccent: true }),
    icon('led', 'LED', ['light emitting diode', 'electronics', 'component', 'light', 'arduino'], [body('M8 11a4 4 0 0 1 8 0v4H8Z'), line('M6.5 15h11M10 15v5.5M14 15v3.5'), accent('M4.5 6 6 7.5M19.5 6 18 7.5M12 3v1.5')]),
    icon('battery-aa', 'AA Battery', ['battery', 'cell', 'power', 'replace battery', 'aa'], [body(R(10.5, 3, 3, 1.8, 0.5)), body(R(8, 4.8, 8, 15.7, 2)), accent('M10.5 12h3M12 10.5v3')]),
    icon('fuse', 'Fuse', ['electronics', 'circuit breaker', 'glass fuse', 'safety', 'component'], [body(R(7, 8, 10, 8, 1.5)), body(R(3.5, 7, 3.5, 10, 1) + R(17, 7, 3.5, 10, 1), { cover: true }), accent('M9 12c1-1.5 2-1.5 3 0s2 1.5 3 0')]),
    icon('antenna', 'Antenna', ['aerial', 'signal', 'radio', 'broadcast', 'transmitter'], [line('M12 9v11.5M8 20.5h8'), body(C(12, 7.5, 1.6)), accent('M8.5 4.5a5 5 0 0 0 0 6M15.5 4.5a5 5 0 0 1 0 6')]),
  ],
};
