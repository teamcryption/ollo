import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'health',
  icons: [
    icon('brain-pricing', 'Brain Pricing', ['pricing', 'cost', 'money', 'brain', 'brain'], [body('M9.5 4.5a2.8 2.8 0 0 0-4.6 1.4A2.8 2.8 0 0 0 3.5 10.5a2.8 2.8 0 0 0 1.6 4.4 2.8 2.8 0 0 0 4.4 1.6 2.8 2.8 0 0 0 4.4-1.6 2.8 2.8 0 0 0 1.6-4.4 2.8 2.8 0 0 0-1.4-4.6 2.8 2.8 0 0 0-4.6-1.4Z'), line('M9.5 4.8v11.4'), line('M6 9.5h1.5M11.5 12.5H13'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('ear-pricing', 'Hearing Pricing', ['pricing', 'cost', 'money', 'hearing', 'ear'], [line('M5 7.5a4.5 4.5 0 0 1 9 0c0 2.5-2 3.5-2.5 5.5S10.5 18 8 18'), line('M7.5 8a2 2 0 0 1 4 0c0 1.2-1.3 1.6-1.6 2.7'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('mortar-pricing', 'Mortar and Pestle Pricing', ['pricing', 'cost', 'money', 'mortar and pestle', 'mortar'], [line('M11.8 9.8 15.5 4'), body('M3.5 10.5h12a6 6 0 0 1-12 0Z'), line('M7 18.2h5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('virus-pricing', 'Virus Pricing', ['pricing', 'cost', 'money', 'virus', 'virus'], [body(C(9.5, 10.5, 4.5)), line('M9.5 3.5V6M9.5 15v2.5M2.5 10.5H5M14 10.5h2.5M4.5 5.5l1.8 1.8M12.7 13.7l1.8 1.8M14.5 5.5l-1.8 1.8M6.3 13.7l-1.8 1.8'), line(D(8, 9.5) + D(11, 11.5)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('hospital-bed-pricing', 'Hospital Bed Pricing', ['pricing', 'cost', 'money', 'hospital bed', 'hospital-bed'], [line('M3 6v12M3 15h13v3'), body(R(3.3, 10.5, 12.5, 2.3, 0.8)), body(R(4.5, 7, 3.5, 2.5, 1)), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('tooth-notice', 'Tooth Notice', ['notice', 'important', 'attention', 'tooth', 'tooth'], [body('M5 4.5c1.5-.8 2.8-.5 4.5.3 1.7-.8 3-1.1 4.5-.3 1.6.9 1.8 3 1.2 5.2-.5 1.8-.8 3.5-1 5.5-.2 1.3-1.5 1.5-2 .2l-.9-3c-.3-.9-1.3-.9-1.6 0l-.9 3c-.5 1.3-1.8 1.1-2-.2-.2-2-.5-3.7-1-5.5C3.2 7.5 3.4 5.4 5 4.5Z'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
  ],
};
