import { icon, body, line, accent } from '../src/dsl.mjs';
import { C, poly } from '../src/geo.mjs';

export default {
  category: 'weather',
  icons: [
    icon('weather-vane', 'Weather Vane', ['wind direction', 'vane', 'rooftop', 'wind', 'compass'], [line('M12 8v12.5M8.5 14h7'), line('M8 8h10M15.5 5.5 18 8l-2.5 2.5'), body(poly([[3.5, 5.5], [7, 5.5], [8.5, 8], [7, 10.5], [3.5, 10.5], [5, 8]], 0.6, true)), accent(C(12, 4.2, 1.2))]),
    icon('anemometer', 'Anemometer', ['wind speed', 'weather station', 'gauge', 'meteorology', 'wind'], [body(C(12, 9, 1.5)), line('M10.5 9H6M13.5 9H18'), body('M3.5 9a2.5 2.5 0 0 1 5 0Z'), body('M15.5 9a2.5 2.5 0 0 0 5 0Z'), line('M12 10.5v10M9 20.5h6')], { noAccent: true }),
  ],
};
