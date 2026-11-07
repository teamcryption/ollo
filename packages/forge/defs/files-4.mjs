import { L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';
import { PAGE, FOLD } from './files.mjs';

const FOLDER = 'M3.5 7A2.5 2.5 0 0 1 6 4.5h3.2a2 2 0 0 1 1.5.7l1.3 1.6h6A2.5 2.5 0 0 1 20.5 9.3v8.2A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5Z';

export default {
  category: 'files',
  icons: [
    icon('file-diff', 'File Diff', ['compare', 'changes', 'patch', 'difference', 'version'], [body(PAGE), line(FOLD), line('M12 10.5v4M10 12.5h4'), accent(L(10, 17.5, 14, 17.5))]),
    icon('folder-download', 'Folder Download', ['download to folder', 'save', 'import', 'receive'], [body(FOLDER), accent('M12 10v6M9.5 13.5 12 16l2.5-2.5')]),
    icon('file-shield', 'Protected File', ['secure document', 'safe file', 'privacy', 'encrypted'], [body(PAGE), line(FOLD), accent('M12 10.5l3 1.2v2.3c0 2-1.3 3.3-3 4-1.7-.7-3-2-3-4v-2.3Z')]),
  ],
};
