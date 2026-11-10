import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'files',
  icons: [
    icon('file-terminal', 'Terminal File', ['script','command line','shell','console','document'], [body('M5.5 5.5A2.5 2.5 0 0 1 8 3h5.5L18.5 8v10.5A2.5 2.5 0 0 1 16 21H8a2.5 2.5 0 0 1-2.5-2.5Z'), line('M13.5 3.2V6.5A1.5 1.5 0 0 0 15 8h3.3'), accent('M9 12l2.2 2-2.2 2M12.5 17h3')]),
    icon('folder-terminal', 'Terminal Folder', ['script','command line','shell','console','directory'], [body('M3.5 7A2.5 2.5 0 0 1 6 4.5h3.2a2 2 0 0 1 1.5.7l1.3 1.6h6A2.5 2.5 0 0 1 20.5 9.3v8.2A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5Z'), accent(translateD('M9 12l2.2 2-2.2 2M12.5 17h3', 0, -1))]),
    icon('file-flag', 'Flagged File', ['flag','important','marked','priority','document'], [body('M5.5 5.5A2.5 2.5 0 0 1 8 3h5.5L18.5 8v10.5A2.5 2.5 0 0 1 16 21H8a2.5 2.5 0 0 1-2.5-2.5Z'), line('M13.5 3.2V6.5A1.5 1.5 0 0 0 15 8h3.3'), accent('M10 18v-6.5h4.5l-1 1.5 1 1.5H10')]),
    icon('folder-flag', 'Flagged Folder', ['flag','important','marked','priority','directory'], [body('M3.5 7A2.5 2.5 0 0 1 6 4.5h3.2a2 2 0 0 1 1.5.7l1.3 1.6h6A2.5 2.5 0 0 1 20.5 9.3v8.2A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5Z'), accent(translateD('M10 18v-6.5h4.5l-1 1.5 1 1.5H10', 0, -1))]),
    icon('folder-globe', 'Web Folder', ['website','html','public','internet','directory'], [body('M3.5 7A2.5 2.5 0 0 1 6 4.5h3.2a2 2 0 0 1 1.5.7l1.3 1.6h6A2.5 2.5 0 0 1 20.5 9.3v8.2A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5Z'), accent(translateD('M12 11a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM8.5 14.5h7M12 11c1 .9 1.5 2.1 1.5 3.5S13 17.1 12 18c-1-.9-1.5-2.1-1.5-3.5S11 11.9 12 11Z', 0, -1))]),
    icon('file-dollar', 'Finance File', ['money','invoice','budget','accounts','document'], [body('M5.5 5.5A2.5 2.5 0 0 1 8 3h5.5L18.5 8v10.5A2.5 2.5 0 0 1 16 21H8a2.5 2.5 0 0 1-2.5-2.5Z'), line('M13.5 3.2V6.5A1.5 1.5 0 0 0 15 8h3.3'), accent('M14 12.3c-.4-.6-1.1-.9-2-.9-1.2 0-2 .6-2 1.4s.8 1.2 2 1.5 2 .7 2 1.6-.8 1.5-2 1.5c-1 0-1.7-.4-2.1-1M12 10.5v.9M12 16.4v1')]),
    icon('folder-dollar', 'Finance Folder', ['money','invoice','budget','accounts','directory'], [body('M3.5 7A2.5 2.5 0 0 1 6 4.5h3.2a2 2 0 0 1 1.5.7l1.3 1.6h6A2.5 2.5 0 0 1 20.5 9.3v8.2A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5Z'), accent(translateD('M14 12.3c-.4-.6-1.1-.9-2-.9-1.2 0-2 .6-2 1.4s.8 1.2 2 1.5 2 .7 2 1.6-.8 1.5-2 1.5c-1 0-1.7-.4-2.1-1M12 10.5v.9M12 16.4v1', 0, -1))]),
  ],
};
