import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'logistics',
  icons: [
    icon('package-heart', 'Care Package', ['gift box', 'parcel with love', 'delivery', 'package', 'package'], [body(R(3.5, 5, 12, 12, 2)), line('M9.5 5.2v3.5'), body(translateD(scaleD('M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z', 0.42), 5.3, 4.8), { cover: true })], { noAccent: true }),
    icon('package-star', 'Priority Parcel', ['premium shipping', 'featured package', 'delivery', 'parcel', 'package'], [body(R(3.5, 5, 12, 12, 2)), line('M9.5 5.2v3.5'), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('package-lock', 'Secure Parcel', ['sealed package', 'locked box', 'protected delivery', 'parcel', 'package'], [body(R(3.5, 5, 12, 12, 2)), line('M9.5 5.2v3.5'), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('package-bolt', 'Express Delivery', ['fast shipping', 'same day', 'quick parcel', 'courier', 'package'], [body(R(3.5, 5, 12, 12, 2)), line('M9.5 5.2v3.5'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
