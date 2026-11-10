import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, L, D, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));

export default {
  category: 'design',
  icons: [
    icon('lasso', 'Lasso Select', ['lasso tool', 'freeform select', 'selection', 'loop', 'cut out'], [line('M8.83 14.03A7.5 5 0 1 1 12 14.5'), body(C(9.2, 15.6, 1.4)), line('M8.4 16.9C7.6 18.5 6.2 19.8 4.5 20.5')], { noAccent: true }),
    icon('drawing-compass', 'Drawing Compass', ['compass tool', 'geometry', 'drafting', 'circle', 'technical drawing'], [body(C(12, 5, 1.8)), line('M11.2 6.7 6.5 20M12.8 6.7 17.5 20'), line('M9.2 13.5h5.6')], { noAccent: true }),
    icon('swatch-book', 'Swatch Book', ['colour swatches', 'palette', 'pantone', 'colour guide', 'samples'], [...rot([body(R(4, 4, 5, 16, 1.5))], 60, 6.5, 17.5), ...rot([body(R(4, 4, 5, 16, 1.5), { cover: true })], 30, 6.5, 17.5), body(R(4, 4, 5, 16, 1.5), { cover: true }), line(D(6.5, 17.5))], { noAccent: true }),
    icon('spiral', 'Spiral', ['spiral tool', 'swirl', 'twist', 'hypnotic', 'vortex'], [line(translateD('M12 12a1.5 1.5 0 0 1 3 0 3 3 0 0 1-6 0 4.5 4.5 0 0 1 9 0 6 6 0 0 1-12 0 7.5 7.5 0 0 1 15 0', -1.5, 0))], { noAccent: true, anim: 'spin' }),
    icon('pencil-ruler', 'Design Tools', ['pencil and ruler', 'drafting', 'stationery', 'create', 'sketch'], [...rot([body(R(10, 2.5, 4, 19, 1)), line('M10.2 6h1.8M10.2 9h1.2M10.2 15h1.2M10.2 18h1.8')], 45), ...rot([body(poly([[10, 3.5], [14, 3.5], [14, 16.5], [12, 20.5], [10, 16.5]], 0.8, true), { cover: true }), line('M10.2 6.5h3.6')], -45)], { noAccent: true }),
  ],
};
