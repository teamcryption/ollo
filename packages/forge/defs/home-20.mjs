import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, rotateD } from '../src/geo.mjs';

export default {
  category: 'home',
  icons: [
    icon('laundry-detergent', 'Laundry Detergent', ['detergent', 'washing liquid', 'laundry', 'soap', 'cleaning'], [body(R(7.5, 3.5, 4, 3, 0.8)), body('M6 8.5a2 2 0 0 1 2-2h4l3 3h1.5a2 2 0 0 1 2 2V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19Z'), accent('M12 12.5c1.2 1.5 2 2.5 2 3.5a2 2 0 0 1-4 0c0-1 .8-2 2-3.5Z')]),
    icon('clothesline', 'Clothesline', ['washing line', 'laundry', 'drying', 'clothes', 'pegs'], [line('M3.5 5.5c5 2.5 12 2.5 17 0'), body('M7.5 7.5 4 9.5l1.2 2.2 1.3-.7V18h5v-7l1.3.7 1.2-2.2-3.5-2Z'), body(R(15, 7.5, 4.5, 9, 1))], { noAccent: true }),
    icon('chandelier', 'Chandelier', ['ceiling light', 'candelabra', 'luxury', 'lighting', 'ballroom'], [line('M12 3.5V9M4.5 13c0 2.2 3.4 3.5 7.5 3.5s7.5-1.3 7.5-3.5M12 16.5v2'), body(R(3.5, 9.5, 2, 3.5, 0.6) + R(18.5, 9.5, 2, 3.5, 0.6) + R(11, 9, 2, 3.5, 0.6)), body(C(12, 19.5, 1.2))], { noAccent: true }),
    icon('fire-extinguisher', 'Fire Extinguisher', ['extinguisher', 'fire safety', 'emergency', 'safety', 'fire'], [body(R(9, 4.5, 4, 3, 0.8)), line('M13 5.5h3.5M9 6C6 6 4.5 7.5 4.5 10.5v3'), body(R(7, 7.5, 8, 13, 3)), accent(L(9.5, 14, 12.5, 14))]),
    icon('extension-cord', 'Extension Cord', ['power strip', 'outlets', 'multi plug', 'electric', 'cable'], [body(R(3.5, 6, 17, 7, 2)), line('M7.5 8.5v2M9.5 8.5v2M14.5 8.5v2M16.5 8.5v2'), line('M12 13v3c0 1.5 1 3 3 3h5.5')], { noAccent: true }),
    icon('tissue-box', 'Tissue Box', ['tissues', 'kleenex', 'cold', 'flu', 'napkin'], [body('M9 10c0-3 1-5 3-6.5 2 1.5 3 3.5 3 6.5Z'), body(R(4, 10, 16, 10, 1.5), { cover: true })], { noAccent: true }),
    icon('soap-dispenser', 'Soap Dispenser', ['hand soap', 'pump bottle', 'hygiene', 'wash hands', 'bathroom'], [line('M12 6.5V4h3.5'), body(R(10, 6.5, 4, 2.5, 0.8)), body(R(6.5, 9, 11, 11.5, 3)), accent(C(11, 15.5, 1.6) + C(14, 13, 1))]),
  ],
};
