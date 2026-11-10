import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, poly } from '../src/geo.mjs';

export default {
  category: 'transport',
  icons: [
    icon('spark-plug', 'Spark Plug', ['ignition', 'engine', 'car parts', 'mechanic', 'garage'], [line('M12 3v2.5'), body(R(10, 5.5, 4, 6, 1.5)), body(R(8.5, 11.5, 7, 3, 0.8)), body(R(10, 14.5, 4, 3.5, 0.5)), line('M12 18v1.5h2'), accent('M16.5 20.5l1.2-1.6')]),
    icon('oil-can', 'Oil Can', ['engine oil', 'lubricant', 'maintenance', 'garage', 'mechanic'], [line('M5.5 11V8.5h4V11'), body(R(3.5, 11, 10, 9, 1.5)), line('M13 13.5 20 8.5'), accent('M19.6 12.2c.8 1 1.2 1.6 1.2 2.2a1.2 1.2 0 0 1-2.4 0c0-.6.4-1.2 1.2-2.2Z')]),
    icon('car-battery', 'Car Battery', ['battery', 'accumulator', 'jump start', 'garage', 'power'], [body(R(5.5, 4.5, 3, 2.5, 0.5)), body(R(15.5, 4.5, 3, 2.5, 0.5)), body(R(3, 7, 18, 12.5, 2)), accent('M6.5 13h3M8 11.5v3M14.5 13h3')]),
    icon('gear-shift', 'Gear Shift', ['gearstick', 'manual', 'transmission', 'stick shift', 'driving'], [body(C(12, 5.5, 2.5)), line('M12 8v5.5'), body(poly([[7, 20.5], [9, 13.5], [15, 13.5], [17, 20.5]], 1, true))], { noAccent: true }),
    icon('car-wash', 'Car Wash', ['wash', 'cleaning', 'auto spa', 'valet', 'garage'], [body(R(3.5, 12, 17, 6, 2)), line('M5.5 12 7 8.5h10l1.5 3.5'), line('M6 18.2v2M18 18.2v2'), accent('M8 3.5v2M12 3v2M16 3.5v2')]),
    icon('speed-bump', 'Speed Bump', ['road hump', 'slow down', 'traffic calming', 'warning', 'road sign'], [body(poly([[12, 3.5], [21, 19.5], [3, 19.5]], 1.5, true)), line('M7.5 16.5h2c.8-2.5 4.2-2.5 5 0h2')], { noAccent: true }),
  ],
};
