import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'transport',
  icons: [
    icon('parking-ahead', 'Parking Ahead', ['car park', 'parking', 'lot', 'road sign', 'driving'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent(scaleD('M10.5 16V8h2.5a2.5 2.5 0 0 1 0 5h-2.5', 0.85, 12, 12))]),
    icon('hospital-ahead', 'Hospital Ahead', ['hospital sign', 'emergency', 'medical', 'road sign', 'driving'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent(scaleD('M9.5 8.5v7M14.5 8.5v7M9.5 12h5', 0.85, 12, 12))]),
    icon('no-cars', 'No Cars', ['motor vehicles prohibited', 'car free', 'pedestrian zone', 'prohibited', 'sign'], [line('M8.5 12.5h7l-1-3h-5Z'), body(R(7.5, 12.5, 9, 3, 1)), line(D(9.5, 16.8) + D(14.5, 16.8)), line('M6 6l12 12'), line(C(12, 12, 8.5))], { noAccent: true }),
  ],
};
