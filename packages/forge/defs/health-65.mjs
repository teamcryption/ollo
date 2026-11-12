import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'health',
  icons: [
    icon('syringe-leaf', 'Eco Syringe', ['eco', 'green', 'sustainable', 'syringe', 'syringe'], [line('M9.5 3.5v2M7.5 3.5h4'), body(R(7.5, 5.5, 4, 9, 1)), line('M9.5 14.5v3'), line('M7.7 8.3h1.8M7.7 11h1.8'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('thermometer-leaf', 'Eco Thermometer', ['eco', 'green', 'sustainable', 'thermometer', 'thermometer'], [body('M8 4.5a1.5 1.5 0 0 1 3 0v7.3a3 3 0 1 1-3 0Z'), line('M9.5 8v5.5'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('bandage-leaf', 'Eco Bandage', ['eco', 'green', 'sustainable', 'bandage', 'bandage'], [body(rotateD(R(2.5, 7.3, 14, 6.4, 3.2), -45, 9.5, 10.5)), line(rotateD(R(7.3, 8.3, 4.4, 4.4, 1), -45, 9.5, 10.5)), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('toothbrush-leaf', 'Eco Toothbrush', ['eco', 'green', 'sustainable', 'toothbrush', 'toothbrush'], [body(R(7.5, 3.5, 4, 6, 1.2)), line('M5 4.8h1.5M5 6.5h1.5M5 8.2h1.5'), line('M9.5 9.7V18'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('ear-leaf', 'Eco Hearing', ['eco', 'green', 'sustainable', 'hearing', 'ear'], [line('M5 7.5a4.5 4.5 0 0 1 9 0c0 2.5-2 3.5-2.5 5.5S10.5 18 8 18'), line('M7.5 8a2 2 0 0 1 4 0c0 1.2-1.3 1.6-1.6 2.7'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('pill-bottle-leaf', 'Eco Pill Bottle', ['eco', 'green', 'sustainable', 'pill bottle', 'pill-bottle'], [body(R(5, 3.5, 9, 3, 1)), body(R(5.5, 7.5, 8, 10.5, 1.5)), line('M7.5 11h4M7.5 13.5h4'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('mortar-leaf', 'Eco Mortar and Pestle', ['eco', 'green', 'sustainable', 'mortar and pestle', 'mortar'], [line('M11.8 9.8 15.5 4'), body('M3.5 10.5h12a6 6 0 0 1-12 0Z'), line('M7 18.2h5'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('toothpaste-leaf', 'Eco Toothpaste', ['eco', 'green', 'sustainable', 'toothpaste', 'toothpaste'], [line('M3.5 7v6'), body('M5 7h8.5l2 1.8v2.4l-2 1.8H5Z'), line('M7.5 10h3'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('ribbon-leaf', 'Eco Awareness Ribbon', ['eco', 'green', 'sustainable', 'awareness ribbon', 'ribbon'], [line('M9.5 9.5c-2-2.5-2.5-4-2.5-4.8a2.5 2.5 0 0 1 5 0c0 .8-.5 2.3-2.5 4.8'), line('M9.5 9.5 5 17.5M9.5 9.5l4.5 8'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
    icon('crutch-leaf', 'Eco Crutch', ['eco', 'green', 'sustainable', 'crutch', 'crutch'], [line('M7 3.5h5M7.5 3.7l2 8M11.5 3.7l-2 8M9.5 11.7V18M8 7.5h3'), body('M13 20.5c0-4.5 3-7.5 8-8 .3 5-2.7 8-8 8Z', { cover: true }), line('M13.6 19.9 17.5 16')], { noAccent: true }),
  ],
};
