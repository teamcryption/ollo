import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'transport',
  icons: [
    icon('piston', 'Piston', ['engine', 'motor', 'cylinder', 'mechanic', 'car parts'], [body(R(6, 3.5, 12, 7, 1.5)), line('M6.2 6h11.6'), line('M12 10.5v5.5'), body(C(12, 18.5, 2.5))], { noAccent: true }),
    icon('car-seat', 'Car Seat', ['seat', 'driver seat', 'vehicle interior', 'upholstery', 'car'], [body(poly([[6, 4], [10, 4], [11, 13], [18, 13.5], [18, 17], [7, 17]], 1.2, true)), line('M8 17v3.5M16 17v3.5')], { noAccent: true }),
    icon('car-door', 'Car Door', ['door', 'vehicle', 'open door', 'car body', 'entry'], [body('M4 9.5 9 4.5h10.5v15H4Z'), line('M7 9.5 10 6.5h7v3Z'), accent('M14 14h3')]),
  ],
};
