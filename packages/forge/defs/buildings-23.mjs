import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'buildings',
  icons: [
    icon('factory-heart', 'Favourite Factory', ['favourite', 'saved', 'like', 'factory', 'factory'], [body(poly([[3, 16.5], [3, 9], [7, 11], [7, 9], [11, 11], [11, 4.5], [15.5, 4.5], [15.5, 16.5]], 0.8, true)), line('M6 14h2M10 14h2'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('factory-star', 'Featured Factory', ['featured', 'top rated', 'best', 'factory', 'factory'], [body(poly([[3, 16.5], [3, 9], [7, 11], [7, 9], [11, 11], [11, 4.5], [15.5, 4.5], [15.5, 16.5]], 0.8, true)), line('M6 14h2M10 14h2'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
  ],
};
