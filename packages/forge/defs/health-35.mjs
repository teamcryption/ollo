import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'health',
  icons: [
    icon('tooth-heart', 'Favourite Tooth', ['favourite', 'saved', 'like', 'tooth', 'tooth'], [body('M5 4.5c1.5-.8 2.8-.5 4.5.3 1.7-.8 3-1.1 4.5-.3 1.6.9 1.8 3 1.2 5.2-.5 1.8-.8 3.5-1 5.5-.2 1.3-1.5 1.5-2 .2l-.9-3c-.3-.9-1.3-.9-1.6 0l-.9 3c-.5 1.3-1.8 1.1-2-.2-.2-2-.5-3.7-1-5.5C3.2 7.5 3.4 5.4 5 4.5Z'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('syringe-heart', 'Favourite Syringe', ['favourite', 'saved', 'like', 'syringe', 'syringe'], [line('M9.5 3.5v2M7.5 3.5h4'), body(R(7.5, 5.5, 4, 9, 1)), line('M9.5 14.5v3'), line('M7.7 8.3h1.8M7.7 11h1.8'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('glasses-heart', 'Favourite Glasses', ['favourite', 'saved', 'like', 'glasses', 'glasses'], [line(C(6, 11, 2.8) + C(13, 11, 2.8)), line('M8.8 11h1.4M3.2 11 3 8.5M15.8 11l.2-2.5'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('tooth-star', 'Featured Tooth', ['featured', 'top rated', 'best', 'tooth', 'tooth'], [body('M5 4.5c1.5-.8 2.8-.5 4.5.3 1.7-.8 3-1.1 4.5-.3 1.6.9 1.8 3 1.2 5.2-.5 1.8-.8 3.5-1 5.5-.2 1.3-1.5 1.5-2 .2l-.9-3c-.3-.9-1.3-.9-1.6 0l-.9 3c-.5 1.3-1.8 1.1-2-.2-.2-2-.5-3.7-1-5.5C3.2 7.5 3.4 5.4 5 4.5Z'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('syringe-star', 'Featured Syringe', ['featured', 'top rated', 'best', 'syringe', 'syringe'], [line('M9.5 3.5v2M7.5 3.5h4'), body(R(7.5, 5.5, 4, 9, 1)), line('M9.5 14.5v3'), line('M7.7 8.3h1.8M7.7 11h1.8'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('glasses-star', 'Featured Glasses', ['featured', 'top rated', 'best', 'glasses', 'glasses'], [line(C(6, 11, 2.8) + C(13, 11, 2.8)), line('M8.8 11h1.4M3.2 11 3 8.5M15.8 11l.2-2.5'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('hospital-alert', 'Hospital Alert', ['alert', 'warning', 'problem', 'hospital', 'hospital'], [body(R(3.5, 4, 12, 15.5, 1.5)), line('M9.5 7.5v4M7.5 9.5h4'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('tooth-alert', 'Tooth Alert', ['alert', 'warning', 'problem', 'tooth', 'tooth'], [body('M5 4.5c1.5-.8 2.8-.5 4.5.3 1.7-.8 3-1.1 4.5-.3 1.6.9 1.8 3 1.2 5.2-.5 1.8-.8 3.5-1 5.5-.2 1.3-1.5 1.5-2 .2l-.9-3c-.3-.9-1.3-.9-1.6 0l-.9 3c-.5 1.3-1.8 1.1-2-.2-.2-2-.5-3.7-1-5.5C3.2 7.5 3.4 5.4 5 4.5Z'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('syringe-alert', 'Syringe Alert', ['alert', 'warning', 'problem', 'syringe', 'syringe'], [line('M9.5 3.5v2M7.5 3.5h4'), body(R(7.5, 5.5, 4, 9, 1)), line('M9.5 14.5v3'), line('M7.7 8.3h1.8M7.7 11h1.8'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('glasses-alert', 'Glasses Alert', ['alert', 'warning', 'problem', 'glasses', 'glasses'], [line(C(6, 11, 2.8) + C(13, 11, 2.8)), line('M8.8 11h1.4M3.2 11 3 8.5M15.8 11l.2-2.5'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
  ],
};
