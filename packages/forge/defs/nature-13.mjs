import { icon, body, line } from '../src/dsl.mjs';
import { R, poly, scaleD, translateD } from '../src/geo.mjs';

const FLAME = 'M12 21a6 6 0 0 0 6-6c0-4-3-6-4-9.5-1.5 2-2 3.6-2 5.2-1-1-1.5-2-1.5-3.2C8 10 6 12.5 6 15a6 6 0 0 0 6 6Z';

export default {
  category: 'nature',
  icons: [
    icon('tsunami', 'Tsunami', ['tidal wave', 'big wave', 'disaster', 'ocean', 'flood'], [body('M3.5 20.5c0-8 5-15 12-15 2.5 0 4.5 1 5 2.5-2.5-.5-5 .5-5 3 0 2 1.5 3 3 3-1 4-4 6.5-8 6.5H3.5Z'), line('M3.5 20.5h17')], { noAccent: true }),
    icon('wildfire', 'Wildfire', ['forest fire', 'bushfire', 'blaze', 'disaster', 'burning'], [line(poly([[3.5, 17], [7, 6], [10.5, 17]], 0.8, true)), line('M7 17v3.5'), body(translateD(scaleD(FLAME, 0.72, 12, 21), 3.8, -0.5))], { noAccent: true }),
    icon('earthquake', 'Earthquake', ['seismic', 'tremor', 'quake', 'disaster', 'richter'], [line('M3 9h4l2-4.5 3 8.5 2-6.5 1.5 2.5H21'), body(R(3, 15, 18, 5.5, 1.5)), line('M12 15l-1.5 2.5 2 1.5-.8 1.5')], { noAccent: true }),
  ],
};
