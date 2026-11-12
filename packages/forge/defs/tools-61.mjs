import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'tools',
  icons: [
    icon('toolbox-pricing', 'Toolbox Pricing', ['pricing', 'cost', 'money', 'toolbox', 'toolbox'], [line('M7 7V5.5h5V7'), body(R(3, 7, 13, 9, 1.5)), line('M3.2 11h12.6'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('flashlight-pricing', 'Flashlight Pricing', ['pricing', 'cost', 'money', 'flashlight', 'flashlight'], [body(R(6, 3.5, 7, 3, 1)), body('M6.5 7.6h6l-1 2.4v7.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V10Z'), line('M9.5 11.5V13'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('sawhorse-pricing', 'Sawhorse Pricing', ['pricing', 'cost', 'money', 'sawhorse', 'sawhorse'], [body(R(3, 6, 13, 2.5, 0.8)), line('M5 8.7 3.5 17.5M7 8.7l1.5 8.8M12 8.7l-1.5 8.8M14 8.7l1.5 8.8'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('toolbox-open-pricing', 'Toolbox Open Pricing', ['pricing', 'cost', 'money', 'toolbox open', 'toolbox-open'], [line('M7 7.5V5.5h5v2'), body(R(3, 7.5, 13, 9.5, 1.5)), line('M3.2 11h12.6M8 11v2h3v-2'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('wrench-notice', 'Wrench Notice', ['notice', 'important', 'attention', 'wrench', 'wrench'], [body('M13.5 3.5a3.5 3.5 0 0 0-3.3 4.6L4 14.3a1.4 1.4 0 0 0 2 2l6.2-6.2A3.5 3.5 0 0 0 16 7l-2 .5-1.5-1.5.5-2Z'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
  ],
};
