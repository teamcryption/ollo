import { icon, body, line } from '../src/dsl.mjs';
import { R, poly } from '../src/geo.mjs';

export default {
  category: 'buildings',
  icons: [
    icon('cottage', 'Cottage', ['cabin', 'country house', 'holiday home', 'chalet', 'rural'], [line('M16 7.2V4.5'), body(poly([[4, 11], [12, 4], [20, 11], [20, 20.5], [4, 20.5]], 1, true)), line('M10 20.3v-3a2 2 0 0 1 4 0v3')], { noAccent: true }),
    icon('pyramid', 'Pyramid', ['egypt', 'ancient', 'monument', 'desert', 'wonder'], [body(poly([[12, 4], [21, 19.5], [3, 19.5]], 1.2, true)), line('M12.3 4.8 15 19.3')], { noAccent: true }),
    icon('arch', 'Arch', ['archway', 'gateway', 'monument', 'stone arch', 'landmark'], [body('M4 20.5V11a8 8 0 0 1 16 0v9.5h-4V11a4 4 0 0 0-8 0v9.5Z')], { noAccent: true }),
    icon('gazebo', 'Gazebo', ['pavilion', 'garden', 'park', 'bandstand', 'shelter'], [body(poly([[3.5, 9], [12, 4], [20.5, 9]], 1, true)), line('M5.5 9v11.5M18.5 9v11.5M12 9v11.5'), line('M5.5 15h13')], { noAccent: true }),
  ],
};
