import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'science',
  icons: [
    icon('lab-coat-pricing', 'Lab Coat Pricing', ['pricing', 'cost', 'money', 'lab coat', 'lab-coat'], [body('M6.5 3.5h6L16 6.5V18H3V6.5Z'), line('M9.5 6v12M6.5 3.7l3 3 3-3'), line('M11.5 12.5h2.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('test-tubes-pricing', 'Test Tubes Pricing', ['pricing', 'cost', 'money', 'test tubes', 'test-tubes'], [body('M5 3.5h3v11a1.5 1.5 0 0 1-3 0Z'), body('M11 3.5h3v11a1.5 1.5 0 0 1-3 0Z'), line('M5.2 9h2.6M11.2 11h2.6'), line('M3 17.5h13'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('flask-notice', 'Flask Notice', ['notice', 'important', 'attention', 'flask', 'flask'], [body('M7 3.5h5v4l4 7.5a1.5 1.5 0 0 1-1.3 2.2H4.3A1.5 1.5 0 0 1 3 15l4-7.5Z'), line('M5.3 12h8.4'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
  ],
};
