const Z = `{ noAccent: true }`;
export default {
  food: [
    `icon('fork', 'Fork', ['cutlery', 'eat', 'dining', 'meal', 'utensil'], [line('M9 3.5v5a3 3 0 0 0 6 0v-5M12 3.5v5M12 11.5v9')], ${Z})`,
    `icon('knife', 'Table Knife', ['cutlery', 'butter knife', 'dining', 'utensil', 'cut'], [body('M14.5 3.5c-2.5 1.5-4.5 5-4.5 9.5h4.5Z'), body(R(11.8, 14.2, 2.7, 6.3, 1.35))], ${Z})`,
    `icon('glass-water', 'Glass of Water', ['water', 'drink', 'hydrate', 'tumbler', 'beverage'], [body(poly([[6.5, 4], [17.5, 4], [16, 20], [8, 20]], 1, true)), line('M7.2 10h9.6'), accent(D(11, 14) + D(13, 16.5))])`,
    `icon('pitcher', 'Pitcher', ['jug', 'water jug', 'lemonade', 'pour', 'serving'], [body('M7.5 4h9l-1.5 3.5c1.5 1.3 2.5 3.2 2.5 5.5v5.5A1.5 1.5 0 0 1 16 20H8a1.5 1.5 0 0 1-1.5-1.5V13c0-2.3 1-4.2 2.5-5.5Z'), line('M17.5 10.5h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1')], ${Z})`,
  ],
  business: [
    `icon('clipboard-list', 'Checklist Clipboard', ['task list', 'clipboard', 'agenda', 'to do', 'inventory'], [body(R(5, 4.5, 14, 16.5, 2.5)), body(R(9, 3, 6, 3.5, 1.5), { cover: true }), line('M8.5 10.5h1M11.5 10.5h4M8.5 14h1M11.5 14h4'), accent('M8.5 17.5h1M11.5 17.5h2.5')])`,
  ],
  communication: [
    `icon('postmark', 'Postmark', ['postage', 'stamp', 'mail', 'cancelled', 'letter'], [line(C(8.5, 12, 4.5)), line('M14 9c1.2-1 2.3-1 3.5 0s2.3 1 3 .5M14 12c1.2-1 2.3-1 3.5 0s2.3 1 3 .5M14 15c1.2-1 2.3-1 3.5 0s2.3 1 3 .5')], ${Z})`,
  ],
  fashion: [
    `icon('bandana', 'Bandana', ['neckerchief', 'scarf', 'cowboy', 'kerchief', 'western'], [body(poly([[3.5, 7], [20.5, 7], [12, 19.5]], 1.5, true)), line(D(9, 10) + D(15, 10) + D(12, 13.5))], ${Z})`,
    `icon('beret', 'Beret', ['french hat', 'artist', 'cap', 'beret hat', 'fashion'], [line('M12 6.5V5'), body('M3.5 13c0-3.6 3.8-6.5 8.5-6.5s8.5 2.9 8.5 6.5c0 1-1 1.5-2 1.5H5.5c-1 0-2-.5-2-1.5Z')], ${Z})`,
    `icon('sun-hat', 'Sun Hat', ['beach hat', 'summer', 'wide brim', 'straw hat', 'holiday'], [body(E(12, 15, 9, 2.5)), body('M7.5 14.5c0-4 2-6.5 4.5-6.5s4.5 2.5 4.5 6.5Z', { cover: true }), line('M7.6 12.5h8.8')], ${Z})`,
  ],
  tools: [
    `icon('pin-cushion', 'Pin Cushion', ['sewing', 'pins', 'needlework', 'craft', 'tailor'], [line('M9 9.5 7.8 5.5M14.5 9.3 15.8 5.3'), body(C(7.6, 4.8, 1.2)), body(C(16, 4.6, 1.2)), body(E(12, 14.5, 7.5, 5.5)), line('M12 9.2v10.6')], ${Z})`,
  ],
  media: [
    `icon('polaroid', 'Instant Photo', ['polaroid', 'snapshot', 'print', 'memories', 'photo'], [body(R(4.5, 3.5, 15, 17, 2)), line(R(7, 6, 10, 10, 0.8)), accent(L(9, 18, 15, 18))])`,
  ],
};
