import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'science',
  icons: [
    icon('oxidizer', 'Oxidizer', ['oxidising', 'ghs', 'hazard', 'flame over circle', 'safety sign'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent(C(12, 15, 1.8) + scaleD('M12 16.5c-1.8 0-3-1.2-3-2.8 0-1.5 1-2.3 1.6-3.5.4 1 1 1.4 1.5 1.5.2-1.5.9-2.6 2-3.5.3 1.6 1.9 2.7 1.9 4.6 0 2.1-1.4 3.7-4 3.7Z', 0.5, 12, 8))]),
    icon('corrosive', 'Corrosive', ['acid', 'ghs', 'hazard', 'chemical burn', 'safety sign'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent(scaleD('M9.5 9s-1.5 1.7-1.5 2.7a1.5 1.5 0 0 0 3 0c0-1-1.5-2.7-1.5-2.7ZM14.5 9s-1.5 1.7-1.5 2.7a1.5 1.5 0 0 0 3 0c0-1-1.5-2.7-1.5-2.7ZM9 15.5h6', 0.8, 12, 12))]),
    icon('health-hazard', 'Health Hazard', ['ghs', 'carcinogen', 'hazard', 'danger to health', 'safety sign'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent(scaleD('M12 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM9.5 16c0-1.8 1.1-3 2.5-3s2.5 1.2 2.5 3', 0.8, 12, 12))]),
    icon('environment-hazard', 'Environmental Hazard', ['ghs', 'pollution', 'aquatic toxicity', 'hazard', 'safety sign'], [body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true)), accent('M12 16.5v-3M12 13.5l-2.5-2M12 13.5l2.5-2M12 11V8.5')]),
  ],
};
