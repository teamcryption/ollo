import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, star, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));

export default {
  category: 'education',
  icons: [
    icon('atlas', 'Atlas', ['world book', 'maps', 'geography', 'travel guide', 'reference'], [body(R(5, 3.5, 14, 17, 1.5)), line('M8 3.7v16.6'), line(C(13.5, 12, 3.5)), line('M10 12h7M13.5 8.5c-1.5 2-1.5 5 0 7')], { noAccent: true }),
    icon('lab-coat', 'Lab Coat', ['scientist', 'doctor', 'laboratory', 'research', 'uniform'], [body('M8 3.5h8l3.5 2.5 1 14.5h-17l1-14.5Z'), line('M8 3.5l4 5 4-5M12 8.5v12'), line('M14.5 14h3')], { noAccent: true }),
    icon('lunch-tray', 'Lunch Tray', ['cafeteria', 'school lunch', 'meal', 'canteen', 'tray'], [body(R(3.5, 5.5, 17, 13, 2.5)), line('M3.7 12h16.6M10 12v6.3M12 5.7V12')], { noAccent: true }),
    icon('report-card', 'Report Card', ['grades', 'school report', 'results', 'marks', 'progress'], [body(R(4.5, 3.5, 15, 17, 2)), line('M7.5 7.5h9M7.5 11h4M7.5 14.5h4'), accent(star(15.5, 13, 2, 0.9, 5, 0.3))]),
  ],
};
