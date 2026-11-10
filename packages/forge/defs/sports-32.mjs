import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'sports',
  icons: [
    icon('trophy-star', 'Top Award', ['best in class', 'champion', 'first place', 'trophy', 'trophy'], [body('M5.5 4h8v3.5a4 4 0 0 1-8 0Z'), line('M5.5 5.5H4a1.5 1.5 0 0 0 0 3h1.7M13.5 5.5H15a1.5 1.5 0 0 1 0 3h-1.7M9.5 11.5V15'), body(R(6.5, 15.5, 6, 2.5, 0.8)), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('trophy-heart', 'Fan Favourite', ['audience award', 'people choice', 'loved', 'trophy', 'trophy'], [body('M5.5 4h8v3.5a4 4 0 0 1-8 0Z'), line('M5.5 5.5H4a1.5 1.5 0 0 0 0 3h1.7M13.5 5.5H15a1.5 1.5 0 0 1 0 3h-1.7M9.5 11.5V15'), body(R(6.5, 15.5, 6, 2.5, 0.8)), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('trophy-pin', 'Championship Venue', ['tournament location', 'final venue', 'stadium', 'trophy', 'trophy'], [body('M5.5 4h8v3.5a4 4 0 0 1-8 0Z'), line('M5.5 5.5H4a1.5 1.5 0 0 0 0 3h1.7M13.5 5.5H15a1.5 1.5 0 0 1 0 3h-1.7M9.5 11.5V15'), body(R(6.5, 15.5, 6, 2.5, 0.8)), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
  ],
};
