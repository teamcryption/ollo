import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'health',
  icons: [
    icon('hospital-trash', 'Delete Hospital', ['delete', 'remove', 'trash', 'hospital', 'hospital'], [body(R(3.5, 4, 12, 15.5, 1.5)), line('M9.5 7.5v4M7.5 9.5h4'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('tooth-trash', 'Delete Tooth', ['delete', 'remove', 'trash', 'tooth', 'tooth'], [body('M5 4.5c1.5-.8 2.8-.5 4.5.3 1.7-.8 3-1.1 4.5-.3 1.6.9 1.8 3 1.2 5.2-.5 1.8-.8 3.5-1 5.5-.2 1.3-1.5 1.5-2 .2l-.9-3c-.3-.9-1.3-.9-1.6 0l-.9 3c-.5 1.3-1.8 1.1-2-.2-.2-2-.5-3.7-1-5.5C3.2 7.5 3.4 5.4 5 4.5Z'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('syringe-trash', 'Delete Syringe', ['delete', 'remove', 'trash', 'syringe', 'syringe'], [line('M9.5 3.5v2M7.5 3.5h4'), body(R(7.5, 5.5, 4, 9, 1)), line('M9.5 14.5v3'), line('M7.7 8.3h1.8M7.7 11h1.8'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('glasses-trash', 'Delete Glasses', ['delete', 'remove', 'trash', 'glasses', 'glasses'], [line(C(6, 11, 2.8) + C(13, 11, 2.8)), line('M8.8 11h1.4M3.2 11 3 8.5M15.8 11l.2-2.5'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('thermometer-trash', 'Delete Thermometer', ['delete', 'remove', 'trash', 'thermometer', 'thermometer'], [body('M8 4.5a1.5 1.5 0 0 1 3 0v7.3a3 3 0 1 1-3 0Z'), line('M9.5 8v5.5'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('bandage-trash', 'Delete Bandage', ['delete', 'remove', 'trash', 'bandage', 'bandage'], [body(rotateD(R(2.5, 7.3, 14, 6.4, 3.2), -45, 9.5, 10.5)), line(rotateD(R(7.3, 8.3, 4.4, 4.4, 1), -45, 9.5, 10.5)), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('brain-trash', 'Delete Brain', ['delete', 'remove', 'trash', 'brain', 'brain'], [body('M9.5 4.5a2.8 2.8 0 0 0-4.6 1.4A2.8 2.8 0 0 0 3.5 10.5a2.8 2.8 0 0 0 1.6 4.4 2.8 2.8 0 0 0 4.4 1.6 2.8 2.8 0 0 0 4.4-1.6 2.8 2.8 0 0 0 1.6-4.4 2.8 2.8 0 0 0-1.4-4.6 2.8 2.8 0 0 0-4.6-1.4Z'), line('M9.5 4.8v11.4'), line('M6 9.5h1.5M11.5 12.5H13'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('toothbrush-trash', 'Delete Toothbrush', ['delete', 'remove', 'trash', 'toothbrush', 'toothbrush'], [body(R(7.5, 3.5, 4, 6, 1.2)), line('M5 4.8h1.5M5 6.5h1.5M5 8.2h1.5'), line('M9.5 9.7V18'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('ear-trash', 'Delete Hearing', ['delete', 'remove', 'trash', 'hearing', 'ear'], [line('M5 7.5a4.5 4.5 0 0 1 9 0c0 2.5-2 3.5-2.5 5.5S10.5 18 8 18'), line('M7.5 8a2 2 0 0 1 4 0c0 1.2-1.3 1.6-1.6 2.7'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('pill-bottle-trash', 'Delete Pill Bottle', ['delete', 'remove', 'trash', 'pill bottle', 'pill-bottle'], [body(R(5, 3.5, 9, 3, 1)), body(R(5.5, 7.5, 8, 10.5, 1.5)), line('M7.5 11h4M7.5 13.5h4'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('mortar-trash', 'Delete Mortar and Pestle', ['delete', 'remove', 'trash', 'mortar and pestle', 'mortar'], [line('M11.8 9.8 15.5 4'), body('M3.5 10.5h12a6 6 0 0 1-12 0Z'), line('M7 18.2h5'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('toothpaste-trash', 'Delete Toothpaste', ['delete', 'remove', 'trash', 'toothpaste', 'toothpaste'], [line('M3.5 7v6'), body('M5 7h8.5l2 1.8v2.4l-2 1.8H5Z'), line('M7.5 10h3'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('stethoscope-trash', 'Delete Stethoscope', ['delete', 'remove', 'trash', 'stethoscope', 'stethoscope'], [line('M5.5 3.5v4.5a3.5 3.5 0 0 0 7 0V3.5'), line('M9 11.5v2a3 3 0 0 0 6 0V12'), line(C(15, 10.5, 1.5)), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
  ],
};
