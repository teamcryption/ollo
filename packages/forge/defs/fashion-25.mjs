import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'fashion',
  icons: [
    icon('scissors-clock', 'Haircut Appointment', ['salon booking', 'barber time', 'hair', 'scissors', 'scissors'], [line('M7.3 11.5 14 4M11.7 11.5 5 4'), body(C(5.5, 14, 2.2)), body(C(13.5, 14, 2.2)), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('scissors-pin', 'Salon Nearby', ['hairdresser location', 'barber map', 'hair', 'scissors', 'scissors'], [line('M7.3 11.5 14 4M11.7 11.5 5 4'), body(C(5.5, 14, 2.2)), body(C(13.5, 14, 2.2)), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('scissors-star', 'Top Stylist', ['best hairdresser', 'rated salon', 'hair', 'scissors', 'scissors'], [line('M7.3 11.5 14 4M11.7 11.5 5 4'), body(C(5.5, 14, 2.2)), body(C(13.5, 14, 2.2)), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('scissors-search', 'Find a Salon', ['hairdresser search', 'barber lookup', 'hair', 'scissors', 'scissors'], [line('M7.3 11.5 14 4M11.7 11.5 5 4'), body(C(5.5, 14, 2.2)), body(C(13.5, 14, 2.2)), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('scissors-heart', 'Favourite Stylist', ['saved salon', 'loved barber', 'hair', 'scissors', 'scissors'], [line('M7.3 11.5 14 4M11.7 11.5 5 4'), body(C(5.5, 14, 2.2)), body(C(13.5, 14, 2.2)), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('hanger-pin', 'Dry Cleaner', ['laundry service location', 'cleaners', 'map', 'clothes', 'hanger'], [line('M9.5 5.5a1.5 1.5 0 1 1 1.5 1.5c-.6 0-1.5.5-1.5 1.5v.5L3.5 13.5h12L9.5 9'), body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))], { noAccent: true }),
    icon('hanger-clock', 'Laundry Pickup', ['collection time', 'dry cleaning', 'ready', 'clothes', 'hanger'], [line('M9.5 5.5a1.5 1.5 0 1 1 1.5 1.5c-.6 0-1.5.5-1.5 1.5v.5L3.5 13.5h12L9.5 9'), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
  ],
};
