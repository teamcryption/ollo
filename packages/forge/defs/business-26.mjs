import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'business',
  icons: [
    icon('megaphone-heart', 'Favourite Megaphone', ['favourite', 'saved', 'like', 'megaphone', 'megaphone'], [body('M3 8.5h3l7.5-4v12L6 12.5H3Z'), line('M5 12.5l1 3.5'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('contract-heart', 'Favourite Contract', ['favourite', 'saved', 'like', 'contract', 'contract'], [body(R(4, 3.5, 11, 14, 1.5)), line('M6.5 7h6M6.5 9.5h6'), line('M6.5 14c.8-1.5 1.5-1.5 2 0s1.2 1.5 2 0'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('contract-star', 'Featured Contract', ['featured', 'top rated', 'best', 'contract', 'contract'], [body(R(4, 3.5, 11, 14, 1.5)), line('M6.5 7h6M6.5 9.5h6'), line('M6.5 14c.8-1.5 1.5-1.5 2 0s1.2 1.5 2 0'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('briefcase-alert', 'Briefcase Alert', ['alert', 'warning', 'problem', 'briefcase', 'briefcase'], [line('M7 7.5V6a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 12 6v1.5'), body(R(3, 7.5, 13, 10, 2)), line('M3.2 11.5h12.6'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('lightbulb-alert', 'Lightbulb Alert', ['alert', 'warning', 'problem', 'lightbulb', 'lightbulb'], [body('M7 13.5v-1c0-.8-.4-1.4-1-2a4.6 4.6 0 1 1 6.5 0c-.6.6-1 1.2-1 2v1Z'), line('M7.3 16h3.9'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('clipboard-alert', 'Clipboard Alert', ['alert', 'warning', 'problem', 'clipboard', 'clipboard'], [body(R(4, 4.5, 10, 13, 2)), body(R(6.5, 3, 5, 2.5, 1), { cover: true }), line('M6.5 9h5M6.5 12h3'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('megaphone-alert', 'Megaphone Alert', ['alert', 'warning', 'problem', 'megaphone', 'megaphone'], [body('M3 8.5h3l7.5-4v12L6 12.5H3Z'), line('M5 12.5l1 3.5'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('contract-alert', 'Contract Alert', ['alert', 'warning', 'problem', 'contract', 'contract'], [body(R(4, 3.5, 11, 14, 1.5)), line('M6.5 7h6M6.5 9.5h6'), line('M6.5 14c.8-1.5 1.5-1.5 2 0s1.2 1.5 2 0'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
  ],
};
