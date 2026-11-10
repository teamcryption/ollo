import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, star, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));


export default {
  category: 'travel',
  icons: [
    icon('travel-pillow', 'Travel Pillow', ['neck pillow', 'flight', 'comfort', 'sleep', 'journey'], [body('M7.3 4a4.6 4.6 0 0 0-3 7.3v1.7c0 4.3 3.6 7.5 7.7 7.5s7.7-3.2 7.7-7.5v-1.7A4.6 4.6 0 0 0 16.7 4c-1.7 0-2.7 1.4-2.7 3.3v4.2a2 2 0 0 1-4 0V7.3C10 5.4 9 4 7.3 4Z')], { noAccent: true }),
    icon('sleep-mask', 'Sleep Mask', ['eye mask', 'blindfold', 'rest', 'night', 'travel'], [body('M3.5 11c0-2.5 2-4 4.5-4h8c2.5 0 4.5 1.5 4.5 4s-2 5-4.5 5c-1.8 0-2.8-1.5-4-1.5s-2.2 1.5-4 1.5c-2.5 0-4.5-2.5-4.5-5Z'), accent('M17.5 3H20l-2.5 1.5H20')]),
    icon('baggage-claim', 'Baggage Claim', ['luggage carousel', 'arrivals', 'airport', 'suitcase', 'belt'], [line('M10.5 5V3.5h3V5'), body(R(8, 5, 8, 9, 1.5)), line('M8.2 9.5h7.6'), body(R(3.5, 16, 17, 4, 2)), line(D(7, 18) + D(12, 18) + D(17, 18))], { noAccent: true }),
    icon('funicular', 'Funicular', ['cliff railway', 'incline', 'mountain train', 'cable railway', 'tram'], [line('M3.5 20.5 20.5 11'), body(poly([[7, 10], [15, 5.5], [15, 12], [7, 16.5]], 1, true)), line('M9 11.5l4-2.2')], { noAccent: true }),
    icon('hot-spring', 'Hot Spring', ['onsen', 'spa', 'thermal bath', 'steam', 'relax'], [line('M4.5 13.5c-1 1-1 2 0 3 1.5 2 4.5 3.5 7.5 3.5s6-1.5 7.5-3.5c1-1 1-2 0-3'), accent('M8 4c-1 1.5 1 3 0 5M12 3.5c-1 1.5 1 3 0 5M16 4c-1 1.5 1 3 0 5')]),
  ],
};
