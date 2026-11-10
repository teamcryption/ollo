import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, star, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));


export default {
  category: 'home',
  icons: [
    icon('high-chair', 'High Chair', ['baby chair', 'feeding', 'toddler', 'nursery', 'kitchen'], [line('M7.5 12.5 5.5 20.5M16.5 12.5l2 8'), body(R(8, 3.5, 8, 9, 1.5)), body(R(5, 10.5, 14, 2.5, 1), { cover: true }), line('M8 17h8')], { noAccent: true }),
    icon('bib', 'Bib', ['baby bib', 'feeding', 'infant', 'mealtime', 'nursery'], [body('M8 3.5a4 4 0 0 0 8 0h2a2 2 0 0 1 2 2v9a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-9a2 2 0 0 1 2-2Z'), accent('M12 16.5l-2.2-2.2a1.3 1.3 0 0 1 2.2-1.8 1.3 1.3 0 0 1 2.2 1.8Z')]),
    icon('crib-mobile', 'Crib Mobile', ['baby mobile', 'nursery', 'hanging toy', 'sleep', 'infant'], [line('M12 3.5v3M5 6.5h14M7 6.5v5M12 6.5V12M17 6.5v5'), body(C(7, 13, 1.5)), body(C(17, 13, 1.5)), accent(star(12, 16.2, 2.2, 1, 5, 0.3))]),
    icon('clothes-rack', 'Clothes Rack', ['garment rail', 'wardrobe', 'boutique', 'hanging clothes', 'closet'], [line('M3.5 4.5h17M5 4.5v16M19 4.5v16M3.5 20.5h3M17.5 20.5h3'), line('M9 4.5V7M15 4.5V7'), body(R(7, 7, 4, 9, 1) + R(13, 7, 4, 7, 1))], { noAccent: true }),
    icon('wall-shelf', 'Wall Shelf', ['shelf', 'floating shelf', 'books', 'decor', 'storage'], [line('M3.5 14h17M6 14v3M18 14v3'), body(R(5.5, 6.5, 2.5, 7.5, 0.6)), body(R(9, 8, 2.5, 6, 0.6)), body(poly([[13.5, 14], [15.9, 14], [18.8, 8.6], [16.6, 7.4]], 0.6, true))], { noAccent: true }),
  ],
};
