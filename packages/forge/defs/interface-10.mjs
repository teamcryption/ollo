import { icon, line, accent } from '../src/dsl.mjs';
import { C, D, L } from '../src/geo.mjs';

const CORNERS = 'M3.5 8V5.5a2 2 0 0 1 2-2H8M16 3.5h2.5a2 2 0 0 1 2 2V8M20.5 16v2.5a2 2 0 0 1-2 2H16M8 20.5H5.5a2 2 0 0 1-2-2V16';

export default {
  category: 'interface',
  icons: [
    icon('scan-text', 'Scan Text', ['ocr', 'text recognition', 'extract text', 'document scan', 'read'], [line(CORNERS), line('M8 9h8M8 12h8'), accent(L(8, 15, 12.5, 15))]),
  ],
};
