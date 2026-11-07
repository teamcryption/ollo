import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const CORNERS = [
  poly([[3.5, 8], [3.5, 3.5], [8, 3.5]], 2),
  poly([[16, 3.5], [20.5, 3.5], [20.5, 8]], 2),
  poly([[20.5, 16], [20.5, 20.5], [16, 20.5]], 2),
  poly([[8, 20.5], [3.5, 20.5], [3.5, 16]], 2),
].map((d) => line(d));
const finder = (x, y) => [body(R(x, y, 6.5, 6.5, 1.5)), line(D(x + 3.25, y + 3.25))];

export default {
  category: 'actions',
  icons: [
    icon('duplicate', 'Duplicate', ['clone', 'copy', 'replicate', 'new copy'], [body(R(4, 4, 11, 11, 2.5)), body(R(9, 9, 11, 11, 2.5), { cover: true }), accent('M14.5 12v5M12 14.5h5')]),
    icon('clipboard-paste', 'Paste', ['paste', 'insert', 'clipboard', 'put'], [body(R(5, 4.5, 14, 16.5, 2.5)), body(R(9, 3, 6, 3.5, 1.5), { cover: true }), accent('M12 9.5v6m-2.2-2.2 2.2 2.2 2.2-2.2')], { anim: { preset: 'bounce', dist: 1 } }),
    icon('trash-restore', 'Restore', ['undelete', 'recover', 'restore', 'bin', 'undo delete'], [line(L(4.5, 6.5, 19.5, 6.5)), line('M9.5 6.5V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5v1'), body('M6.5 9h11l-.75 9.1A2.1 2.1 0 0 1 14.66 20H9.34a2.1 2.1 0 0 1-2.09-1.9Z'), accent('M12 17v-5m-2 2 2-2 2 2')], { anim: { preset: 'bounce', dist: -1 } }),
    icon('backspace', 'Backspace', ['delete key', 'erase', 'clear', 'keyboard', 'remove'], [body('M8.5 5H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8.5L3 12Z'), accent('M11.5 9.5l5 5m0-5-5 5')], { anim: { preset: 'nudge', dir: [-1, 0], dist: 1.5 } }),
    icon('scan', 'Scan', ['scanner', 'capture', 'read', 'camera scan', 'detect'], [...CORNERS, accent(L(6.5, 12, 17.5, 12))], { anim: { preset: 'bounce', dist: 2 } }),
    icon('fit-screen', 'Fit to Screen', ['fit', 'zoom to fit', 'frame', 'focus', 'bounds'], [...CORNERS, accent(R(8, 8, 8, 8, 1.5))]),
    icon('qr-code', 'QR Code', ['qr', 'scan code', 'barcode', 'link', 'ticket'], [...finder(3.5, 3.5), ...finder(14, 3.5), ...finder(3.5, 14), line(D(14.5, 14.5)), line(D(17.5, 17.5)), line(D(20.2, 14.5)), line(D(14.5, 20.2)), line(D(20.2, 20.2)), accent(D(12, 12))]),
  ],
};
