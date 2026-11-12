import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'files',
  icons: [
    icon('paperclip-flag', 'Report Attachment', ['report', 'flag', 'mark', 'attachment', 'paperclip'], [line('M13 9.5 8.3 14.2a2.2 2.2 0 0 1-3.1-3.1l6-6a3.4 3.4 0 0 1 4.8 4.8l-6 6'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('floppy-flag', 'Report Floppy Disk', ['report', 'flag', 'mark', 'floppy disk', 'floppy'], [body('M3.5 5A1.5 1.5 0 0 1 5 3.5h8.5L16 6v10a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 16Z'), line('M6.5 3.7V7H12V3.7'), line('M6.5 17.3v-4.8h6v4.8'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
    icon('archive-flag', 'Report Archive', ['report', 'flag', 'mark', 'archive', 'archive'], [body(R(3, 4, 13, 3.5, 1)), body('M4 8.7h11v8a1.3 1.3 0 0 1-1.3 1.3H5.3A1.3 1.3 0 0 1 4 16.7Z'), line('M7.5 11.5h4'), body('M14.3 13h6l-1.5 2.2 1.5 2.3h-6Z', { cover: true }), line('M14.3 13v8')], { noAccent: true }),
  ],
};
