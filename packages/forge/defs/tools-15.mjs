import { icon, body, line } from '../src/dsl.mjs';
import { R, poly, rotateD } from '../src/geo.mjs';

const rot = (els, deg) => els.map((e) => ({ ...e, d: rotateD(e.d, deg) }));

export default {
  category: 'tools',
  icons: [
    icon('paint-scraper', 'Paint Scraper', ['putty knife', 'spackle', 'scraper', 'decorating', 'diy'], [body(R(10.5, 3, 3, 8, 1.2)), body(poly([[9, 12.5], [15, 12.5], [17, 20.5], [7, 20.5]], 0.8, true))], { noAccent: true }),
    icon('workbench', 'Workbench', ['bench', 'workshop', 'carpentry', 'garage', 'diy'], [line('M7 8V5.5h4V8'), body(R(3, 8, 18, 3, 1)), line('M5 11v9.5M19 11v9.5M5 16.5h14')], { noAccent: true }),
  ],
};
