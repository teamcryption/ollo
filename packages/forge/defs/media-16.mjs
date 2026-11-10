import { icon, body, line } from '../src/dsl.mjs';
import { R } from '../src/geo.mjs';

export default {
  category: 'media',
  icons: [
    icon('film-strip', 'Film Strip', ['negative', 'movie', 'cinema', 'photo film', '35mm'], [body(R(5, 3, 14, 18, 1.5)), line('M7.3 6v1M7.3 11.5v1M7.3 17v1M16.7 6v1M16.7 11.5v1M16.7 17v1'), line('M9.5 9h5M9.5 15h5')], { noAccent: true }),
  ],
};
