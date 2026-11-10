import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'devices',
  icons: [
    icon('laptop-search', 'Computer Search', ['find on computer', 'device search', 'lookup', 'laptop', 'laptop'], [body(R(5, 5, 12, 8.5, 1.5)), line('M3 16h10'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('laptop-clock', 'Screen Time', ['usage time', 'work hours', 'timer', 'laptop', 'laptop'], [body(R(5, 5, 12, 8.5, 1.5)), line('M3 16h10'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('laptop-heart', 'Favourite Device', ['liked laptop', 'wishlist', 'computer', 'love', 'laptop'], [body(R(5, 5, 12, 8.5, 1.5)), line('M3 16h10'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('laptop-star', 'Top Laptop', ['best computer', 'rated device', 'featured', 'laptop', 'laptop'], [body(R(5, 5, 12, 8.5, 1.5)), line('M3 16h10'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('smartphone-search', 'Phone Search', ['find on phone', 'device search', 'app search', 'mobile', 'smartphone'], [body(R(4, 3, 9.5, 17, 2.5)), line('M7.5 5.5h2.5'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('smartphone-heart', 'Favourite App', ['liked app', 'saved', 'mobile', 'love', 'smartphone'], [body(R(4, 3, 9.5, 17, 2.5)), line('M7.5 5.5h2.5'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('smartphone-star', 'Top App', ['rated app', 'featured', 'app store', 'mobile', 'smartphone'], [body(R(4, 3, 9.5, 17, 2.5)), line('M7.5 5.5h2.5'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
  ],
};
