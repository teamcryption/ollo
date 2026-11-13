import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'files',
  icons: [
    icon('folder-2', 'Folder Alt', ['directory', 'files', 'organize', 'storage'], [body('M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z'), accent(L(6.5, 16, 10.5, 16))]),
    icon('folder-3', 'Folder Tab', ['directory', 'files', 'tab', 'archive'], [body('M3 9h18v9.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z'), line('M3.5 9V6a2 2 0 0 1 2-2h3.5l2 3h8.5a1.5 1.5 0 0 1 1.5 1.5'), accent(L(7, 15, 10, 15))]),
  ],
};
