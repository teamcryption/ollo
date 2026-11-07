import { R, L, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'tools',
  icons: [
    icon('watering-can', 'Watering Can', ['garden', 'plants', 'water', 'gardening', 'grow'], [line('M6.5 11.5H5a2 2 0 0 0-2 2v1.5a2 2 0 0 0 2 2h1.5'), line(L(8.5, 7.5, 12.5, 7.5)), line(L(15, 16.5, 19, 8.5)), line(L(17.9, 8, 20.1, 9)), body(R(6.5, 9.5, 8.5, 11, 1.5)), accent(D(21, 12.5) + D(20, 15))]),
    icon('rake', 'Rake', ['garden', 'leaves', 'gardening', 'yard', 'autumn'], [line(L(12, 3, 12, 15)), line('M9 15l3-3 3 3'), line('M4.5 15h15M4.5 15v4.5M8.25 15v4.5M15.75 15v4.5M19.5 15v4.5M12 15v4.5')], { noAccent: true }),
  ],
};
