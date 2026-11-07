import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

// Page with a folded corner, shared by the file family.
const PAGE = 'M5.5 5.5A2.5 2.5 0 0 1 8 3h5.5L18.5 8v10.5A2.5 2.5 0 0 1 16 21H8a2.5 2.5 0 0 1-2.5-2.5Z';
const FOLD = 'M13.5 3.2V6.5A1.5 1.5 0 0 0 15 8h3.3';
const page = (...inner) => [body(PAGE), line(FOLD), ...inner];
const FILE_BADGES = ['add', 'remove', 'check', 'close', 'alert'];

export default {
  category: 'files',
  icons: [
    icon('file', 'File', ['document', 'page', 'paper', 'blank'], page(accent(L(9, 16.5, 13, 16.5))), { badges: FILE_BADGES }),
    icon('file-text', 'File Text', ['document', 'text', 'page', 'notes', 'article'], page(line(L(9, 12.5, 15, 12.5)), accent(L(9, 16, 12.5, 16))), { badges: ['add', 'check', 'close'] }),
    icon('file-code', 'File Code', ['document', 'code', 'html', 'script', 'developer'], page(line(poly([[10.2, 11.5], [8.6, 13.5], [10.2, 15.5]], 0.6)), accent(poly([[13.8, 11.5], [15.4, 13.5], [13.8, 15.5]], 0.6)))),
    icon('file-image', 'File Image', ['document', 'image', 'picture', 'photo', 'jpg'], page(line(poly([[8.8, 17.5], [11, 14.8], [12.6, 16.4], [13.6, 15.4], [15.2, 17.5]], 0.6)), accent(C(10.2, 10.8, 1)))),
    icon('file-chart', 'File Chart', ['document', 'report', 'chart', 'analytics', 'stats'], page(line(L(9.5, 17, 9.5, 14.5)), line(L(12, 17, 12, 11.5)), accent(L(14.5, 17, 14.5, 13)))),
    icon('file-zip', 'File Zip', ['archive', 'compressed', 'zip', 'document', 'rar'], page(line(L(10, 4, 10, 5)), line(L(10, 7.5, 10, 8.5)), line(L(10, 11, 10, 12)), accent(R(8.8, 14.5, 2.4, 3, 1)))),
    icon('file-search', 'File Search', ['document', 'find', 'lookup', 'search', 'browse'], page(line(C(11.3, 13.3, 2.4)), line(L(13.4, 15.4, 15, 17))), { noAccent: true }),
    icon('file-lock', 'File Lock', ['document', 'secure', 'private', 'protected', 'locked'], page(line('M10.4 13v-1a1.6 1.6 0 0 1 3.2 0v1'), body(R(9, 13, 6, 4.5, 1.2))), { noAccent: true }),
    icon('files', 'Files', ['documents', 'pages', 'copies', 'stack', 'multiple'], [body(R(9, 3, 10.5, 13.5, 2.5)), body(R(4.5, 7, 10.5, 14, 2.5), { cover: true }), accent(L(7.5, 14, 12, 14))], { badges: ['add', 'check'] }),
    icon('folder-open', 'Folder Open', ['directory', 'open', 'browse', 'explore'], [line('M3.5 17.5V6.5a2 2 0 0 1 2-2h3.4l2 2h6.6a2 2 0 0 1 2 2v1'), body(poly([[5.5, 10.5], [20.8, 10.5], [18.6, 19.5], [3.5, 19.5]], 1.5, true), { cover: true })], { noAccent: true }),
    icon('folder-plain', 'Folder Plain', ['directory', 'collection', 'group', 'category'], [body('M3.5 7A2.5 2.5 0 0 1 6 4.5h3.2a2 2 0 0 1 1.5.7l1.3 1.6h6A2.5 2.5 0 0 1 20.5 9.3v8.2A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5Z'), accent(L(7, 10.5, 11, 10.5))], { badges: FILE_BADGES }),
    icon('clipboard', 'Clipboard', ['paste', 'board', 'tasks', 'checklist', 'copy'], [body(R(5, 4.5, 14, 16.5, 2.5)), body(R(9, 3, 6, 3.5, 1.5), { cover: true }), line(L(9, 12, 15, 12)), accent(L(9, 15.5, 12.5, 15.5))], { badges: ['check', 'close', 'add'] }),
    icon('archive', 'Archive', ['box', 'storage', 'store', 'backup', 'package'], [body(R(3.5, 4, 17, 4.5, 1.5)), body('M5 10.5h14v7a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 17.5Z'), accent(L(10, 13.5, 14, 13.5))], { anim: { preset: 'bounce', dist: -1.5 } }),
    icon('paperclip', 'Paperclip', ['attachment', 'attach', 'clip', 'file'], [line('M15.5 7.5l-6.2 6.2a1.8 1.8 0 0 0 2.5 2.5l6.5-6.5a3.6 3.6 0 0 0-5.1-5.1L6.7 11.1a5.4 5.4 0 0 0 7.6 7.6l5-5')], { noAccent: true, anim: 'wiggle' }),
    icon('cloud', 'Cloud', ['storage', 'online', 'sync', 'weather', 'server'], [body('M7 18.5a4 4 0 0 1-.6-8 5.8 5.8 0 0 1 11.2 1.1A3.5 3.5 0 0 1 17 18.5Z'), accent(A(12, 12.3, 3, 200, 260))], { badges: ['add', 'check', 'close', 'alert'], anim: { preset: 'bounce', dist: -1.5 } }),
    icon('cloud-upload', 'Cloud Upload', ['upload', 'sync', 'backup', 'cloud', 'send'], [line('M7 17.5a4 4 0 0 1-.6-8 5.8 5.8 0 0 1 11.2 1.1A3.5 3.5 0 0 1 17.2 17.5'), line(L(12, 20, 12, 13)), line(poly([[9.8, 14.8], [12, 12.6], [14.2, 14.8]], 0.6))], { variants: [{ name: 'cloud-download', title: 'Cloud Download', tags: ['download', 'sync', 'restore', 'cloud', 'get'], els: [line('M7 17.5a4 4 0 0 1-.6-8 5.8 5.8 0 0 1 11.2 1.1A3.5 3.5 0 0 1 17.2 17.5'), line(L(12, 12.6, 12, 19.6)), line(poly([[9.8, 17.6], [12, 19.8], [14.2, 17.6]], 0.6))] }], anim: { preset: 'bounce', dist: -1.5 }, noAccent: true }),
    icon('book', 'Book', ['read', 'library', 'manual', 'guide', 'study'], [body(R(5, 3.5, 14, 17, 2.5)), line(L(8.5, 3.7, 8.5, 20.3)), accent(L(11.5, 8, 15.5, 8))], { badges: ['add', 'check'] }),
    icon('book-open', 'Book Open', ['read', 'reading', 'pages', 'learn', 'magazine'], [body('M12 6.5C10.2 5 7.6 4.5 4 4.8v12.4c3.6-.3 6.2.2 8 1.8Z'), body('M12 6.5c1.8-1.5 4.4-2 8-1.7v12.4c-3.6-.3-6.2.2-8 1.8Z'), accent(L(14.5, 9.5, 17.5, 9))]),
    icon('note', 'Note', ['sticky', 'memo', 'post-it', 'reminder', 'text'], [body('M4.5 7A2.5 2.5 0 0 1 7 4.5h10A2.5 2.5 0 0 1 19.5 7v6.5l-6 6H7a2.5 2.5 0 0 1-2.5-2.5Z'), line('M19.3 13.5h-3.8a2 2 0 0 0-2 2v3.8'), accent(L(8, 9, 14, 9))], { badges: ['add', 'check'] }),
    icon('database', 'Database', ['storage', 'data', 'sql', 'server', 'records'], [body('M5 6.5c0-1.7 3.1-3 7-3s7 1.3 7 3v11c0 1.7-3.1 3-7 3s-7-1.3-7-3Z'), line('M5.2 6.8c.7 1.5 3.4 2.7 6.8 2.7s6.1-1.2 6.8-2.7'), line('M5.2 12.2c.7 1.5 3.4 2.6 6.8 2.6s6.1-1.1 6.8-2.6'), accent(D(15.5, 17.5))], { badges: ['add', 'check', 'close', 'alert'] }),
  ],
};
