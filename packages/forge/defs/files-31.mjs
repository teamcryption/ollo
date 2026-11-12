import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'files',
  icons: [
    icon('paperclip-cursor', 'Select Attachment', ['select', 'click', 'pointer', 'attachment', 'paperclip'], [line('M13 9.5 8.3 14.2a2.2 2.2 0 0 1-3.1-3.1l6-6a3.4 3.4 0 0 1 4.8 4.8l-6 6'), body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('floppy-cursor', 'Select Floppy Disk', ['select', 'click', 'pointer', 'floppy disk', 'floppy'], [body('M3.5 5A1.5 1.5 0 0 1 5 3.5h8.5L16 6v10a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 16Z'), line('M6.5 3.7V7H12V3.7'), line('M6.5 17.3v-4.8h6v4.8'), body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('archive-cursor', 'Select Archive', ['select', 'click', 'pointer', 'archive', 'archive'], [body(R(3, 4, 13, 3.5, 1)), body('M4 8.7h11v8a1.3 1.3 0 0 1-1.3 1.3H5.3A1.3 1.3 0 0 1 4 16.7Z'), line('M7.5 11.5h4'), body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('folder-cursor', 'Select Folder', ['select', 'click', 'pointer', 'folder', 'folder'], [body('M3 6.5A1.5 1.5 0 0 1 4.5 5h3.2l1.5 1.8h5.3a1.5 1.5 0 0 1 1.5 1.5v8.2a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 16.5Z'), body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('file-cursor', 'Select File', ['select', 'click', 'pointer', 'file', 'file'], [body('M5 3.5h6l4 4v10a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 5 3.5Z'), line('M11 3.7V7.5h3.8'), body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('folder-open-cursor', 'Select Folder Open', ['select', 'click', 'pointer', 'folder open', 'folder-open'], [body('M3 6a1.5 1.5 0 0 1 1.5-1.5h3.5l1.5 2h5A1.5 1.5 0 0 1 16 8v1H6.5L3 16Z'), body('M6 9.3h11l-3 7.2H3Z'), body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('file-zip-cursor', 'Select File Zip', ['select', 'click', 'pointer', 'file zip', 'file-zip'], [body('M5 3h6.5L15 6.5V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z'), line('M8 4v1.5M9.5 5.5V7M8 7v1.5M9.5 8.5V10'), body(R(7.5, 11, 3, 3, 0.6)), body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('file-image-cursor', 'Select File Image', ['select', 'click', 'pointer', 'file image', 'file-image'], [body('M5 3h6.5L15 6.5V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z'), line('M6.5 15.5 9 12.5l1.8 1.8 1.2-1.3 1.5 2.5'), line(C(8, 9, 1)), body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('documents-stack-cursor', 'Select Documents Stack', ['select', 'click', 'pointer', 'documents stack', 'documents-stack'], [body('M7 3h6.5L16 5.5V14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z'), line('M4 6v10.5A1.5 1.5 0 0 0 5.5 18H13'), body(poly([[13.6, 12.6], [20.6, 15.6], [17.6, 16.8], [16.4, 20.2]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
