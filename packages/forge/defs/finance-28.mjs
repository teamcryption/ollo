import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'finance',
  icons: [
    icon('atm-heart', 'Favourite ATM', ['favourite', 'saved', 'like', 'atm', 'atm'], [body(R(3.5, 4, 12, 13, 1.5)), line(R(6, 6.5, 7, 4, 0.6)), line('M7 14h5'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('umbrella-star', 'Featured Umbrella', ['featured', 'top rated', 'best', 'umbrella', 'umbrella'], [line('M3 10a6.5 6.5 0 0 1 13 0ZM9.5 10v5.5a1.5 1.5 0 0 0 3 0'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('atm-star', 'Featured ATM', ['featured', 'top rated', 'best', 'atm', 'atm'], [body(R(3.5, 4, 12, 13, 1.5)), line(R(6, 6.5, 7, 4, 0.6)), line('M7 14h5'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('bank-alert', 'Bank Alert', ['alert', 'warning', 'problem', 'bank', 'bank'], [body(poly([[9.5, 3.5], [16, 7], [3, 7]], 0.8, true)), line('M5.5 9.5v5M9.5 9.5v5M13.5 9.5v5M3 17.5h12'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('card-alert', 'Card Alert', ['alert', 'warning', 'problem', 'card', 'card'], [body(R(3, 5, 13, 9.5, 1.5)), line('M3.2 8.5h12.6'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('piggy-alert', 'Piggy Bank Alert', ['alert', 'warning', 'problem', 'piggy bank', 'piggy'], [body('M4 10.5c0-2.5 2.5-4.5 6-4.5 1.5 0 2.8.3 3.8 1l1.7-1v2.3c.6.6 1 1.4 1 2.2H15c0 1.2-.6 2.3-1.5 3V16h-2v-1.2h-3V16h-2v-2c-1.5-.8-2.5-2-2.5-3.5Z'), line('M8.5 5.5h3'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('umbrella-alert', 'Umbrella Alert', ['alert', 'warning', 'problem', 'umbrella', 'umbrella'], [line('M3 10a6.5 6.5 0 0 1 13 0ZM9.5 10v5.5a1.5 1.5 0 0 0 3 0'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('atm-alert', 'ATM Alert', ['alert', 'warning', 'problem', 'atm', 'atm'], [body(R(3.5, 4, 12, 13, 1.5)), line(R(6, 6.5, 7, 4, 0.6)), line('M7 14h5'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
  ],
};
