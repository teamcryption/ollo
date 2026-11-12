import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'finance',
  icons: [
    icon('card-pricing', 'Card Pricing', ['pricing', 'cost', 'money', 'card', 'card'], [body(R(3, 5, 13, 9.5, 1.5)), line('M3.2 8.5h12.6'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('piggy-pricing', 'Piggy Bank Pricing', ['pricing', 'cost', 'money', 'piggy bank', 'piggy'], [body('M4 10.5c0-2.5 2.5-4.5 6-4.5 1.5 0 2.8.3 3.8 1l1.7-1v2.3c.6.6 1 1.4 1 2.2H15c0 1.2-.6 2.3-1.5 3V16h-2v-1.2h-3V16h-2v-2c-1.5-.8-2.5-2-2.5-3.5Z'), line('M8.5 5.5h3'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('wallet-pricing', 'Wallet Pricing', ['pricing', 'cost', 'money', 'wallet', 'wallet'], [body(R(3, 5.5, 13, 11, 2)), line('M15.8 9h-3.3a1.5 1.5 0 0 0 0 3h3.3'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('trend-pricing', 'Growth Pricing', ['pricing', 'cost', 'money', 'growth', 'trend'], [line('M3.5 15l4-4 3 3 5.5-6'), line('M12.5 8H16v3.5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('blockchain-pricing', 'Blockchain Pricing', ['pricing', 'cost', 'money', 'blockchain', 'blockchain'], [body(R(3, 3, 5, 5, 1)), body(R(11, 3, 5, 5, 1)), body(R(3, 12.5, 5, 5, 1)), body(R(11, 12.5, 5, 5, 1)), line('M8.2 5.5h2.6M5.5 8.2v4.1M13.5 8.2v4.1M8.2 15h2.6'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14v5M18.3 15.1c-.3-.4-.8-.6-1.3-.6-.7 0-1.3.4-1.3 1s.6.9 1.3 1 1.3.4 1.3 1-.6 1-1.3 1c-.6 0-1.1-.2-1.4-.6')], { noAccent: true }),
    icon('piggy-notice', 'Piggy Bank Notice', ['notice', 'important', 'attention', 'piggy bank', 'piggy'], [body('M4 10.5c0-2.5 2.5-4.5 6-4.5 1.5 0 2.8.3 3.8 1l1.7-1v2.3c.6.6 1 1.4 1 2.2H15c0 1.2-.6 2.3-1.5 3V16h-2v-1.2h-3V16h-2v-2c-1.5-.8-2.5-2-2.5-3.5Z'), line('M8.5 5.5h3'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
    icon('atm-notice', 'ATM Notice', ['notice', 'important', 'attention', 'atm', 'atm'], [body(R(3.5, 4, 12, 13, 1.5)), line(R(6, 6.5, 7, 4, 0.6)), line('M7 14h5'), body(R(13, 12.5, 8, 8, 2), { cover: true }), line('M17 14.5v2.6'), line(D(17, 18.6))], { noAccent: true }),
  ],
};
