import { R, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'design',
  icons: [
    icon('spray-can', 'Spray Can', ['spray paint', 'graffiti', 'aerosol', 'airbrush', 'paint'], [body(R(7, 9, 9, 11.5, 2)), line(R(9, 5.5, 5, 3.5, 0.8)), accent([D(18, 4.5), D(20, 6.5), D(18, 8.5), D(20, 10.5)].join(''))]),
  ],
};
