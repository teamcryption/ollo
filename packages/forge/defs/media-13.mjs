import { icon, body, line } from '../src/dsl.mjs';
import { R } from '../src/geo.mjs';

export default {
  category: 'media',
  icons: [
    icon('mic-stand', 'Mic Stand', ['microphone stand', 'stage', 'karaoke', 'singer', 'concert'], [body(R(9.5, 3, 5, 8, 2.5)), line('M12 11v9.5M12 14l-4.5 6.5M12 14l4.5 6.5')], { noAccent: true }),
  ],
};
