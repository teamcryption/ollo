import { R, star } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';
import { PAGE, FOLD } from './files.mjs';

export default {
  category: 'files',
  icons: [
    icon('file-star', 'Starred File', ['favourite file', 'important document', 'bookmark file', 'featured'], [body(PAGE), line(FOLD), accent(star(12, 14.5, 3.4, 1.5, 5, 0.4))]),
    icon('folder-tree', 'Folder Tree', ['directory', 'hierarchy', 'file tree', 'structure', 'explorer'], [line('M5 3.5V16a1.75 1.75 0 0 0 1.75 1.75H12'), line('M5 8.75h7'), body(R(12, 6, 8.5, 5.5, 1.5)), body(R(12, 15, 8.5, 5.5, 1.5))], { noAccent: true }),
  ],
};
