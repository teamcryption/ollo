import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'nature',
  icons: [
    icon('plant-clock', 'Watering Schedule', ['plant care reminder', 'water plants', 'garden', 'plant', 'plant'], [line('M9.5 11V8M9.5 8c-2 0-3.5-1.3-3.5-3.5 2 0 3.5 1.3 3.5 3.5Zm0 0c2 0 3.5-1.3 3.5-3.5-2 0-3.5 1.3-3.5 3.5Z'), body('M5 11h9l-1 6a1 1 0 0 1-1 .8H7a1 1 0 0 1-1-.8Z'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('plant-heart', 'Plant Care', ['love plants', 'houseplant', 'gardening', 'plant', 'plant'], [line('M9.5 11V8M9.5 8c-2 0-3.5-1.3-3.5-3.5 2 0 3.5 1.3 3.5 3.5Zm0 0c2 0 3.5-1.3 3.5-3.5-2 0-3.5 1.3-3.5 3.5Z'), body('M5 11h9l-1 6a1 1 0 0 1-1 .8H7a1 1 0 0 1-1-.8Z'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('plant-search', 'Plant ID', ['identify plant', 'plant finder', 'botany', 'plant', 'plant'], [line('M9.5 11V8M9.5 8c-2 0-3.5-1.3-3.5-3.5 2 0 3.5 1.3 3.5 3.5Zm0 0c2 0 3.5-1.3 3.5-3.5-2 0-3.5 1.3-3.5 3.5Z'), body('M5 11h9l-1 6a1 1 0 0 1-1 .8H7a1 1 0 0 1-1-.8Z'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
  ],
};
