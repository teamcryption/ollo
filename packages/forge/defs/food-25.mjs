import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, star, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));


export default {
  category: 'food',
  icons: [
    icon('honey-dipper', 'Honey Dipper', ['honey', 'drizzle', 'sweet', 'breakfast', 'bee'], rot([line('M12 3.5v8'), body(R(8.5, 11.5, 7, 9, 2.5)), line('M8.7 14h6.6M8.7 17h6.6')], -30), { noAccent: true }),
    icon('chocolate-bar', 'Chocolate Bar', ['candy bar', 'sweets', 'cocoa', 'snack', 'dessert'], [body(R(6, 3.5, 12, 12, 1.5)), line('M6.2 7.5h11.6M6.2 11.5h11.6M12 3.7v8'), body('M5 12.5l2 1 2-1 2 1 2-1 2 1 2-1 2 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1Z', { cover: true })], { noAccent: true }),
    icon('pudding', 'Pudding', ['flan', 'custard', 'caramel', 'dessert', 'creme caramel'], [body(poly([[7, 7.5], [17, 7.5], [18.5, 17], [5.5, 17]], 2, true)), line('M6.9 10.5h10.2'), line('M3.5 19.5h17')], { noAccent: true }),
  ],
};
