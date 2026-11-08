import { R, D, poly, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const hex = (cx, cy, r) => poly([0, 60, 120, 180, 240, 300].map((a) => [cx + r * Math.cos(((a + 30) * Math.PI) / 180), cy + r * Math.sin(((a + 30) * Math.PI) / 180)]), 0.4, true);
const FILL = [];
for (let i = 0; i <= 10; i++) {
  const a = ((145 - i * 11) * Math.PI) / 180, r = i % 2 ? 11.2 : 10.2;
  FILL.push([12 + r * Math.cos(a), 18 - r * Math.sin(a)]);
}

export default {
  category: 'food',
  icons: [
    icon('spatula', 'Spatula', ['turner', 'flip', 'kitchen', 'cooking', 'pancake'], [body(R(8.5, 3, 7, 8, 1.5)), line('M10.5 5v4M12 5v4M13.5 5v4'), line('M12 11v2'), body(R(10.8, 13, 2.4, 7.5, 1.2))], { noAccent: true }),
    icon('grater', 'Grater', ['cheese', 'grate', 'kitchen', 'shred', 'cooking'], [line('M9.5 6V3.5h5V6'), body(poly([[7, 6], [17, 6], [19, 20.5], [5, 20.5]], 1, true)), line('M9 10h1.5M13.5 10h1.5M8.5 13.5H10M14 13.5h1.5M8 17h1.5M14.5 17H16M11.25 11.75h1.5M11.25 15.25h1.5')], { noAccent: true }),
    icon('cutting-board', 'Cutting Board', ['chopping board', 'kitchen', 'prep', 'cooking', 'wood'], [body('M5.5 8h9a2.5 2.5 0 0 1 2.5 2.5V12h2a1.5 1.5 0 0 1 1.5 1.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-2V18a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 3 18v-7.5A2.5 2.5 0 0 1 5.5 8Z'), line('M6.5 12h6M6.5 16h4'), line(D(18.8, 14.25))], { noAccent: true }),
    icon('honey-jar', 'Honey Jar', ['honey', 'jar', 'sweet', 'bee', 'preserve', 'jam'], [body(R(6.5, 4.5, 11, 3.5, 1)), body(R(5, 8.5, 14, 12, 3)), accent(hex(12, 14.5, 2.5))]),
    icon('taco', 'Taco', ['mexican', 'tortilla', 'street food', 'fast food', 'meal'], [line(poly(FILL, 0.6, false)), body('M3.5 18a8.5 8.5 0 0 1 17 0Z')], { noAccent: true }),
    icon('candy', 'Candy', ['sweet', 'wrapped', 'bonbon', 'treat', 'halloween'], [body(rotateD(poly([[8.3, 12], [4, 8.5], [4, 15.5]], 0.6, true), -30)), body(rotateD(poly([[15.7, 12], [20, 8.5], [20, 15.5]], 0.6, true), -30)), body(rotateD('M12 8.5a4 3.5 0 1 1 0 7 4 3.5 0 1 1 0-7Z', -30), { cover: true }), line(rotateD('M11.2 8.7 10.2 15.3M13.8 8.7l-1 6.6', -30))], { noAccent: true }),
    icon('broccoli', 'Broccoli', ['vegetable', 'greens', 'healthy', 'veggie', 'produce'], [body(poly([[9.5, 12.5], [14.5, 12.5], [13.5, 20.5], [10.5, 20.5]], 0.8, true)), body('M7.5 13a3 3 0 0 1-.6-5.9 3.5 3.5 0 0 1 6.6-2 3 3 0 0 1 4.3 2.5A3 3 0 0 1 16.5 13Z', { cover: true })], { noAccent: true }),
    icon('salt-shaker', 'Salt Shaker', ['salt', 'pepper', 'seasoning', 'spice', 'table'], [body(poly([[8, 8.5], [16, 8.5], [17, 20.5], [7, 20.5]], 1, true)), body('M8 8.5a4 4 0 0 1 8 0Z'), line(D(10.5, 6.9) + D(12, 6) + D(13.5, 6.9))], { noAccent: true }),
    icon('tea-bag', 'Tea Bag', ['tea', 'infusion', 'drink', 'herbal', 'brew'], [line('M11 10V7a1.5 1.5 0 0 1 1.5-1.5h4'), body(R(16.5, 3.5, 4, 4.5, 0.8)), body(poly([[6.5, 11.5], [8, 10], [14, 10], [15.5, 11.5], [15.5, 20.5], [6.5, 20.5]], 0.8, true)), line('M9 15.5h4')], { noAccent: true }),
  ],
};
