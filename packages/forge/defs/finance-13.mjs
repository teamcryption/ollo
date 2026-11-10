import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'finance',
  icons: [
    icon('dollar-sign', 'Dollar Sign', ['usd', 'currency', 'money', 'price', 'dollar'], [line('M16 7.5c-.7-1.3-2.1-2-4-2-2.5 0-4 1.2-4 3s1.5 2.6 4 3.2 4 1.5 4 3.3-1.5 3.3-4 3.3c-2 0-3.5-.8-4.2-2.2M12 3.5v2M12 18.3v2.2')], { noAccent: true }),
    icon('euro-sign', 'Euro Sign', ['eur', 'currency', 'money', 'price', 'europe'], [line('M17.6 7.4A6.5 6.5 0 1 0 17.6 16.6M4.5 10.5h9M4.5 13.5h9')], { noAccent: true }),
    icon('pound-sign', 'Pound Sign', ['gbp', 'sterling', 'currency', 'money', 'uk'], [line('M16.5 7.5c-.5-1.8-2-3-4-3-2.5 0-4 1.8-4 4v11.5M6 19.5h11M6 13h8')], { noAccent: true }),
    icon('yen-sign', 'Yen Sign', ['jpy', 'yuan', 'currency', 'money', 'japan'], [line('M6 4.5l6 7.5 6-7.5M12 12v7.5M8 13h8M8 16h8')], { noAccent: true }),
    icon('rupee-sign', 'Rupee Sign', ['inr', 'india', 'currency', 'money', 'price'], [line('M6.5 4.5h11M6.5 8.5h11M9.5 4.5c4 0 5 1.6 5 4s-1.5 4-5 4H7l7.5 7')], { noAccent: true }),
    icon('ruble-sign', 'Ruble Sign', ['rub', 'currency', 'money', 'russia', 'price'], [line('M8.5 20V4.5h5a4 4 0 0 1 0 8H6M6 16h8')], { noAccent: true }),
    icon('won-sign', 'Won Sign', ['krw', 'korea', 'currency', 'money', 'price'], [line('M4.5 5 8 19l4-12 4 12 3.5-14M3.5 10.5h17')], { noAccent: true }),
    icon('naira-sign', 'Naira Sign', ['ngn', 'nigeria', 'currency', 'money', 'price'], [line('M7 19.5v-15l10 15v-15M4.5 10h15M4.5 14h15')], { noAccent: true }),
    icon('franc-sign', 'Franc Sign', ['chf', 'swiss franc', 'currency', 'money', 'price'], [line('M9 19.5v-15h8.5M9 11.5h7M6 16h7')], { noAccent: true }),
    icon('cent-sign', 'Cent Sign', ['cents', 'change', 'currency', 'coins', 'price'], [line('M16.2 8.8A4.5 4.5 0 1 0 16.2 15.2M12.5 5v14')], { noAccent: true }),
    icon('peso-sign', 'Peso Sign', ['php', 'philippines', 'currency', 'money', 'price'], [line('M9 20V4.5h4.5a4 4 0 0 1 0 8H9M6 7.5h12M6 10h12')], { noAccent: true }),
  ],
};
