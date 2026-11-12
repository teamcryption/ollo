import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'files',
  icons: [
    icon('paperclip-checkbox', 'Approve Attachment', ['approve', 'check', 'verified', 'attachment', 'paperclip'], [line('M13 9.5 8.3 14.2a2.2 2.2 0 0 1-3.1-3.1l6-6a3.4 3.4 0 0 1 4.8 4.8l-6 6'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')], { noAccent: true }),
    icon('floppy-checkbox', 'Approve Floppy Disk', ['approve', 'check', 'verified', 'floppy disk', 'floppy'], [body('M3.5 5A1.5 1.5 0 0 1 5 3.5h8.5L16 6v10a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 16Z'), line('M6.5 3.7V7H12V3.7'), line('M6.5 17.3v-4.8h6v4.8'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')], { noAccent: true }),
    icon('archive-checkbox', 'Approve Archive', ['approve', 'check', 'verified', 'archive', 'archive'], [body(R(3, 4, 13, 3.5, 1)), body('M4 8.7h11v8a1.3 1.3 0 0 1-1.3 1.3H5.3A1.3 1.3 0 0 1 4 16.7Z'), line('M7.5 11.5h4'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')], { noAccent: true }),
    icon('folder-checkbox', 'Approve Folder', ['approve', 'check', 'verified', 'folder', 'folder'], [body('M3 6.5A1.5 1.5 0 0 1 4.5 5h3.2l1.5 1.8h5.3a1.5 1.5 0 0 1 1.5 1.5v8.2a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 16.5Z'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')], { noAccent: true }),
    icon('file-checkbox', 'Approve File', ['approve', 'check', 'verified', 'file', 'file'], [body('M5 3.5h6l4 4v10a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 5 3.5Z'), line('M11 3.7V7.5h3.8'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')], { noAccent: true }),
    icon('folder-open-checkbox', 'Approve Folder Open', ['approve', 'check', 'verified', 'folder open', 'folder-open'], [body('M3 6a1.5 1.5 0 0 1 1.5-1.5h3.5l1.5 2h5A1.5 1.5 0 0 1 16 8v1H6.5L3 16Z'), body('M6 9.3h11l-3 7.2H3Z'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')], { noAccent: true }),
    icon('file-zip-checkbox', 'Approve File Zip', ['approve', 'check', 'verified', 'file zip', 'file-zip'], [body('M5 3h6.5L15 6.5V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z'), line('M8 4v1.5M9.5 5.5V7M8 7v1.5M9.5 8.5V10'), body(R(7.5, 11, 3, 3, 0.6)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')], { noAccent: true }),
    icon('file-image-checkbox', 'Approve File Image', ['approve', 'check', 'verified', 'file image', 'file-image'], [body('M5 3h6.5L15 6.5V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z'), line('M6.5 15.5 9 12.5l1.8 1.8 1.2-1.3 1.5 2.5'), line(C(8, 9, 1)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')], { noAccent: true }),
    icon('documents-stack-checkbox', 'Approve Documents Stack', ['approve', 'check', 'verified', 'documents stack', 'documents-stack'], [body('M7 3h6.5L16 5.5V14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z'), line('M4 6v10.5A1.5 1.5 0 0 0 5.5 18H13'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M15.2 16.6l1.3 1.3 2.4-2.6')], { noAccent: true }),
    icon('paperclip-addbox', 'New Attachment', ['new', 'add', 'create', 'attachment', 'paperclip'], [line('M13 9.5 8.3 14.2a2.2 2.2 0 0 1-3.1-3.1l6-6a3.4 3.4 0 0 1 4.8 4.8l-6 6'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.1 16.5h3.8')], { noAccent: true }),
    icon('folder-addbox', 'New Folder', ['new', 'add', 'create', 'folder', 'folder'], [body('M3 6.5A1.5 1.5 0 0 1 4.5 5h3.2l1.5 1.8h5.3a1.5 1.5 0 0 1 1.5 1.5v8.2a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 16.5Z'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.1 16.5h3.8')], { noAccent: true }),
    icon('file-addbox', 'New File', ['new', 'add', 'create', 'file', 'file'], [body('M5 3.5h6l4 4v10a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 5 3.5Z'), line('M11 3.7V7.5h3.8'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.6v3.8M15.1 16.5h3.8')], { noAccent: true }),
  ],
};
