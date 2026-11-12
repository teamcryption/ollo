import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'interface',
  icons: [
    icon('list-pricing', 'List Pricing', ['pricing', 'cost', 'money', 'list', 'list'], [line('M7 6h8.5M7 10.5h8.5M7 15h8.5'), line(D(4, 6) + D(4, 10.5) + D(4, 15)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('browser-pricing', 'Browser Pricing', ['pricing', 'cost', 'money', 'browser', 'browser'], [body(R(3, 4.5, 13, 12, 1.8)), line('M3.2 8h12.6'), line(D(5.5, 6.2) + D(7.5, 6.2)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('trash-notice', 'Trash Notice', ['notice', 'important', 'attention', 'trash', 'trash'], [line('M3.5 6h12M7.5 6V4.5h4V6'), body('M5 6.5h9l-.8 10a1.5 1.5 0 0 1-1.5 1.4H7.3a1.5 1.5 0 0 1-1.5-1.4Z'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
    icon('edit-notice', 'Document Notice', ['notice', 'important', 'attention', 'document', 'edit'], [body(poly([[12.5, 3.5], [15.5, 6.5], [7, 15], [3.5, 16], [4.5, 12.5]], 0.8, true)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
    icon('idcard-notice', 'ID Card Notice', ['notice', 'important', 'attention', 'id card', 'idcard'], [body(R(4, 3.5, 11, 14, 2)), line(C(9.5, 8.5, 2)), line('M6.5 14a3 3 0 0 1 6 0'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
    icon('firstaid-notice', 'First Aid Notice', ['notice', 'important', 'attention', 'first aid', 'firstaid'], [line('M7.5 6V4.5h4V6'), body(R(3.5, 6, 12, 10, 2)), line('M9.5 8.8v4.4M7.3 11h4.4'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
  ],
};
