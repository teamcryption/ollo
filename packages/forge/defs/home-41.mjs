import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'home',
  icons: [
    icon('fridge-heart', 'Favourite Fridge', ['favourite', 'saved', 'like', 'fridge', 'fridge'], [body(R(5, 3.5, 9, 14, 1.5)), line('M5.2 8.5h8.6M7 5.5v1.5M7 10.5v2.5'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('washer-heart', 'Favourite Washer', ['favourite', 'saved', 'like', 'washer', 'washer'], [body(R(4, 3.5, 11, 14, 1.5)), line('M4.2 6.5h10.6'), line(C(9.5, 11.5, 3)), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('oven-heart', 'Favourite Oven', ['favourite', 'saved', 'like', 'oven', 'oven'], [body(R(4, 4, 11, 13, 1.5)), line(R(6, 8.5, 7, 6, 0.8)), line('M6.5 6.2h1M9 6.2h1'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('water-heart', 'Favourite Water', ['favourite', 'saved', 'like', 'water', 'water'], [body('M9.5 3.5c2.5 3 4.5 5.5 4.5 8.3a4.5 4.5 0 0 1-9 0c0-2.8 2-5.3 4.5-8.3Z'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('fridge-star', 'Featured Fridge', ['featured', 'top rated', 'best', 'fridge', 'fridge'], [body(R(5, 3.5, 9, 14, 1.5)), line('M5.2 8.5h8.6M7 5.5v1.5M7 10.5v2.5'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('washer-star', 'Featured Washer', ['featured', 'top rated', 'best', 'washer', 'washer'], [body(R(4, 3.5, 11, 14, 1.5)), line('M4.2 6.5h10.6'), line(C(9.5, 11.5, 3)), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('oven-star', 'Featured Oven', ['featured', 'top rated', 'best', 'oven', 'oven'], [body(R(4, 4, 11, 13, 1.5)), line(R(6, 8.5, 7, 6, 0.8)), line('M6.5 6.2h1M9 6.2h1'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('sofa-star', 'Featured Sofa', ['featured', 'top rated', 'best', 'sofa', 'sofa'], [line('M5 9V7a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14 7v2'), body(R(3, 9, 13, 6, 1.5)), line('M4.5 15v2M14.5 15v2'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('water-star', 'Featured Water', ['featured', 'top rated', 'best', 'water', 'water'], [body('M9.5 3.5c2.5 3 4.5 5.5 4.5 8.3a4.5 4.5 0 0 1-9 0c0-2.8 2-5.3 4.5-8.3Z'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('fridge-alert', 'Fridge Alert', ['alert', 'warning', 'problem', 'fridge', 'fridge'], [body(R(5, 3.5, 9, 14, 1.5)), line('M5.2 8.5h8.6M7 5.5v1.5M7 10.5v2.5'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('washer-alert', 'Washer Alert', ['alert', 'warning', 'problem', 'washer', 'washer'], [body(R(4, 3.5, 11, 14, 1.5)), line('M4.2 6.5h10.6'), line(C(9.5, 11.5, 3)), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('oven-alert', 'Oven Alert', ['alert', 'warning', 'problem', 'oven', 'oven'], [body(R(4, 4, 11, 13, 1.5)), line(R(6, 8.5, 7, 6, 0.8)), line('M6.5 6.2h1M9 6.2h1'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('sofa-alert', 'Sofa Alert', ['alert', 'warning', 'problem', 'sofa', 'sofa'], [line('M5 9V7a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14 7v2'), body(R(3, 9, 13, 6, 1.5)), line('M4.5 15v2M14.5 15v2'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
    icon('water-alert', 'Water Alert', ['alert', 'warning', 'problem', 'water', 'water'], [body('M9.5 3.5c2.5 3 4.5 5.5 4.5 8.3a4.5 4.5 0 0 1-9 0c0-2.8 2-5.3 4.5-8.3Z'), body(poly([[17, 11.5], [21.3, 20.5], [12.7, 20.5]], 0.9, true), { cover: true }), line('M17 15v2.3'), line(D(17, 19.1))], { noAccent: true }),
  ],
};
