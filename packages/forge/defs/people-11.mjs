import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'people',
  icons: [
    icon('gender-male', 'Male', ['man', 'mars symbol', 'gender', 'sex', 'boy'], [line(C(10, 14, 5.5)), line('M14 10l5.5-5.5M14.5 4.5h5v5')], { noAccent: true }),
    icon('gender-female', 'Female', ['woman', 'venus symbol', 'gender', 'sex', 'girl'], [line(C(12, 9, 5.5)), line('M12 14.5v6M9 17.5h6')], { noAccent: true }),
    icon('gender-neutral', 'Gender Neutral', ['non-binary', 'neutral', 'gender', 'inclusive', 'agender'], [line(C(12, 9, 5.5)), line('M12 14.5v6')], { noAccent: true }),
  ],
};
