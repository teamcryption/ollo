import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, poly } from '../src/geo.mjs';

export default {
  category: 'health',
  icons: [
    icon('eye-drops', 'Eye Drops', ['dropper', 'eye care', 'medicine', 'drops', 'optometry'], [body(R(8.5, 3, 7, 8.5, 1.5)), body(poly([[9.5, 11.5], [14.5, 11.5], [13, 15], [11, 15]], 0.6, true)), accent('M12 17c.9 1.2 1.5 2 1.5 2.7a1.5 1.5 0 0 1-3 0c0-.7.6-1.5 1.5-2.7Z')]),
    icon('heart-monitor', 'Heart Monitor', ['ecg', 'ekg', 'vital signs', 'cardiac', 'hospital'], [body(R(3, 4, 18, 13, 2)), line('M5.5 11h3l1.5-3 2.5 6 1.5-3h4.5'), line('M12 17v3.5M8.5 20.5h7')], { noAccent: true }),
    icon('iv-drip', 'IV Drip', ['infusion', 'drip', 'saline', 'hospital', 'treatment'], [line('M8.5 3.5h7M8.5 3.5V5M15.5 3.5v17M12.5 20.5h6'), body(R(5, 5, 7, 8.5, 2.5)), line('M8.5 13.5v2.5a3 3 0 0 0 3 3h1')], { noAccent: true }),
  ],
};
