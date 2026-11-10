import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, poly, rotateD } from '../src/geo.mjs';

const rot = (els, deg) => els.map((e) => ({ ...e, d: rotateD(e.d, deg) }));

export default {
  category: 'education',
  icons: [
    icon('marker', 'Marker', ['felt tip', 'sharpie', 'pen', 'draw', 'whiteboard marker'], rot([body(R(9.5, 2.8, 5, 6, 1.5)), body(R(9, 9, 6, 8.5, 1.5)), body(poly([[10.5, 17.5], [13.5, 17.5], [12.6, 20.8], [11.4, 20.8]], 0.4, true))], 45), { noAccent: true }),
    icon('index-card', 'Index Card', ['note card', 'flashcard', 'study', 'notes', 'revision'], [body(R(3, 5, 18, 14, 1.5)), line('M3.2 9h17.6M6 12.5h12'), accent('M6 15.5h8')]),
  ],
};
