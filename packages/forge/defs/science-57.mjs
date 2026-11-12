import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'science',
  icons: [
    icon('lab-coat-trash', 'Delete Lab Coat', ['delete', 'remove', 'trash', 'lab coat', 'lab-coat'], [body('M6.5 3.5h6L16 6.5V18H3V6.5Z'), line('M9.5 6v12M6.5 3.7l3 3 3-3'), line('M11.5 12.5h2.5'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('molecule-trash', 'Delete Molecule', ['delete', 'remove', 'trash', 'molecule', 'molecule'], [line(C(9.5, 10.5, 2.2) + C(4.5, 5, 1.6) + C(14.5, 5, 1.6) + C(9.5, 17, 1.6)), line('M5.6 6.2 8 8.8M13.4 6.2 11 8.8M9.5 12.7v2.7'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('astronaut-trash', 'Delete Astronaut', ['delete', 'remove', 'trash', 'astronaut', 'astronaut'], [body(C(9.5, 7.5, 4.5)), body(R(6.8, 5.8, 5.4, 3.4, 1.4)), body('M4.5 18v-2a3.5 3.5 0 0 1 3.5-3.5h3a3.5 3.5 0 0 1 3.5 3.5v2Z'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('dna-helix-trash', 'Delete Dna Helix', ['delete', 'remove', 'trash', 'dna helix', 'dna-helix'], [line('M6 3.5c0 4 7 4 7 7s-7 3-7 7M13 3.5c0 4-7 4-7 7s7 3 7 7'), line('M7.5 6h4M7.5 15h4'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('test-tubes-trash', 'Delete Test Tubes', ['delete', 'remove', 'trash', 'test tubes', 'test-tubes'], [body('M5 3.5h3v11a1.5 1.5 0 0 1-3 0Z'), body('M11 3.5h3v11a1.5 1.5 0 0 1-3 0Z'), line('M5.2 9h2.6M11.2 11h2.6'), line('M3 17.5h13'), body('M14.6 14.6h4.8l-.5 5.9h-3.8Z', { cover: true }), line('M13.8 14.6h6.4M16 14.4v-1.2h2v1.2')], { noAccent: true }),
    icon('lab-coat-flag', 'Report Lab Coat', ['report', 'flag', 'mark', 'lab coat', 'lab-coat'], [body('M6.5 3.5h6L16 6.5V18H3V6.5Z'), line('M9.5 6v12M6.5 3.7l3 3 3-3'), line('M11.5 12.5h2.5'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('molecule-flag', 'Report Molecule', ['report', 'flag', 'mark', 'molecule', 'molecule'], [line(C(9.5, 10.5, 2.2) + C(4.5, 5, 1.6) + C(14.5, 5, 1.6) + C(9.5, 17, 1.6)), line('M5.6 6.2 8 8.8M13.4 6.2 11 8.8M9.5 12.7v2.7'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('astronaut-flag', 'Report Astronaut', ['report', 'flag', 'mark', 'astronaut', 'astronaut'], [body(C(9.5, 7.5, 4.5)), body(R(6.8, 5.8, 5.4, 3.4, 1.4)), body('M4.5 18v-2a3.5 3.5 0 0 1 3.5-3.5h3a3.5 3.5 0 0 1 3.5 3.5v2Z'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('dna-helix-flag', 'Report Dna Helix', ['report', 'flag', 'mark', 'dna helix', 'dna-helix'], [line('M6 3.5c0 4 7 4 7 7s-7 3-7 7M13 3.5c0 4-7 4-7 7s7 3 7 7'), line('M7.5 6h4M7.5 15h4'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('test-tubes-flag', 'Report Test Tubes', ['report', 'flag', 'mark', 'test tubes', 'test-tubes'], [body('M5 3.5h3v11a1.5 1.5 0 0 1-3 0Z'), body('M11 3.5h3v11a1.5 1.5 0 0 1-3 0Z'), line('M5.2 9h2.6M11.2 11h2.6'), line('M3 17.5h13'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
  ],
};
