import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, poly } from '../src/geo.mjs';

export default {
  category: 'science',
  icons: [
    icon('oscilloscope', 'Oscilloscope', ['waveform', 'signal', 'electronics', 'lab', 'measure'], [body(R(3, 4.5, 18, 13, 2)), line(R(5.5, 7, 9, 8, 1)), line('M7 11c1-2 2-2 3 0s2 2 3 0'), accent(D(17.5, 9)), line(D(17.5, 13)), line('M6 17.5v2M18 17.5v2')]),
    icon('rain-gauge', 'Rain Gauge', ['precipitation', 'rainfall', 'weather station', 'measure', 'meteorology'], [body(poly([[8, 3.5], [16, 3.5], [14.5, 7], [14.5, 20.5], [9.5, 20.5], [9.5, 7]], 0.6, true)), line('M9.7 10h2M9.7 13h2M9.7 16h2')], { noAccent: true }),
    icon('weather-balloon', 'Weather Balloon', ['radiosonde', 'meteorology', 'balloon', 'atmosphere', 'science'], [body(C(12, 8.5, 5.5)), line('M12 14v3'), body(R(10, 17, 4, 3.5, 0.8))], { noAccent: true }),
  ],
};
