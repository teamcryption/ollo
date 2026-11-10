import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, poly, star, rotateD } from '../src/geo.mjs';

export default {
  category: 'gaming',
  icons: [
    icon('tombstone', 'Tombstone', ['grave', 'rip', 'cemetery', 'halloween', 'memorial'], [body('M6 19V9a6 6 0 0 1 12 0v10Z'), line('M12 8v6M10 10h4'), line('M3.5 20.5h17')], { noAccent: true }),
    icon('coffin', 'Coffin', ['casket', 'vampire', 'halloween', 'funeral', 'spooky'], [body(poly([[9, 3], [15, 3], [17.5, 8], [15.5, 21], [8.5, 21], [6.5, 8]], 1, true)), line('M12 8v6M10 10h4')], { noAccent: true }),
    icon('spell-book', 'Spell Book', ['grimoire', 'magic', 'fantasy', 'wizard', 'rpg'], [body(R(5, 3, 14, 18, 2)), line('M8 3.2v17.6'), accent(star(13.5, 11.5, 3, 1.3, 4, 0.3))]),
    icon('knight-helmet', 'Knight Helmet', ['armor', 'medieval', 'knight', 'rpg', 'warrior'], [body('M5.5 20.5 6 10a6 6 0 0 1 12 0l.5 10.5Z'), line('M8 11.5h8M12 14v6.3')], { noAccent: true }),
    icon('watchtower', 'Watchtower', ['castle tower', 'fortress', 'medieval', 'rpg', 'keep'], [body('M6 3.5h2.5v2h2v-2h3v2h2v-2H18V8l-1.5 1.5v11h-9v-11L6 8Z'), line('M12 11v2.5')], { noAccent: true }),
    icon('throne', 'Throne', ['king', 'royal', 'seat', 'monarchy', 'power'], [body('M7 12V5l2.5 2L12 3.5 14.5 7 17 5v7Z'), body(R(5, 12, 14, 3.5, 1), { cover: true }), line('M6.5 15.5v5M17.5 15.5v5')], { noAccent: true }),
    icon('torch', 'Torch', ['flame', 'fire', 'medieval', 'light', 'olympic'], [body('M8.5 13h7l-.5 2h-1.7l-.5 5.5h-1.6l-.5-5.5H9Z'), accent('M12 3c1.8 1.8 3 3.4 3 4.8a3 3 0 0 1-6 0c0-1.4 1.2-3 3-4.8Z')]),
    icon('message-bottle', 'Message in a Bottle', ['castaway', 'letter', 'sea', 'note', 'island'], [body(rotateD(R(3.5, 8, 12, 8, 2.5), -20)), body(rotateD(R(15.5, 10, 3.5, 4, 0.8), -20), { cover: true }), body(rotateD(R(19, 10.5, 1.6, 3, 0.4), -20)), accent(rotateD(R(6, 10.6, 6.5, 2.8, 1.4), -20))]),
    icon('jack-o-lantern', "Jack-o'-lantern", ['halloween', 'pumpkin', 'carved', 'spooky', 'october'], [line('M12 7.2V5a2 2 0 0 1 2-2'), body(E(12, 13.5, 8.5, 6.5)), accent(poly([[7.5, 12.5], [10, 12.5], [8.75, 10.3]], 0.3, true) + poly([[14, 12.5], [16.5, 12.5], [15.25, 10.3]], 0.3, true) + 'M8 15.5l1.6 1.4 1.6-1.2 1.6 1.2 1.6-1.2 1.6 1.2')]),
    icon('goblet', 'Goblet', ['chalice', 'cup', 'medieval', 'grail', 'wine'], [body('M7 4h10c0 5-2 8-5 8s-5-3-5-8Z'), line('M12 12v6'), body(R(8, 18, 8, 2.5, 1)), accent(C(12, 7, 1))]),
  ],
};
