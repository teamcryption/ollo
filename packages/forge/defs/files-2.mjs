import { R, C, L, poly } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';
import { PAGE, FOLD } from './files.mjs';

const page = (...inner) => [body(PAGE), line(FOLD), ...inner];
const FOLDER = 'M3.5 7A2.5 2.5 0 0 1 6 4.5h3.2a2 2 0 0 1 1.5.7l1.3 1.6h6A2.5 2.5 0 0 1 20.5 9.3v8.2A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5Z';
const DOWN = [line(L(12, 10.5, 12, 16.5)), line(poly([[9.5, 14], [12, 16.5], [14.5, 14]], 0.5))];

export default {
  category: 'files',
  icons: [
    icon('file-audio', 'File Audio', ['document', 'audio', 'music', 'mp3', 'sound'], page(line('M11.3 16.5V11l3.5-1'), body(C(10, 16.6, 1.3))), { noAccent: true }),
    icon('file-video', 'File Video', ['document', 'video', 'movie', 'mp4', 'clip'], page(accent(poly([[10.5, 12], [14.5, 14.5], [10.5, 17]], 0.5, true)))),
    icon('file-spreadsheet', 'File Spreadsheet', ['document', 'sheet', 'excel', 'csv', 'table'], page(line(R(8.5, 11, 7, 6.5, 1)), line(L(8.7, 14.25, 15.3, 14.25)), line(L(12, 11.2, 12, 17.3))), { noAccent: true }),
    icon('file-download', 'File Download', ['document', 'download', 'save', 'export'], page(...DOWN), { noAccent: true, variants: [{ name: 'file-upload', title: 'File Upload', tags: ['document', 'upload', 'import', 'attach'], els: page(line(L(12, 16.5, 12, 10.5)), line(poly([[9.5, 13], [12, 10.5], [14.5, 13]], 0.5))) }] }),
    icon('folder-lock', 'Folder Lock', ['directory', 'private', 'secure', 'locked'], [body(FOLDER), line('M10.5 13v-1a1.5 1.5 0 0 1 3 0v1'), body(R(9.5, 13, 5, 4, 1))], { noAccent: true }),
    icon('folder-search', 'Folder Search', ['directory', 'find', 'browse', 'lookup'], [body(FOLDER), line(C(11.5, 13, 2.3)), line(L(13.2, 14.7, 15, 16.5))], { noAccent: true }),
    icon('folder-code', 'Folder Code', ['directory', 'project', 'repository', 'source'], [body(FOLDER), line(poly([[10.2, 11], [8.5, 13], [10.2, 15]], 0.5)), accent(poly([[13.8, 11], [15.5, 13], [13.8, 15]], 0.5))]),
  ],
};
