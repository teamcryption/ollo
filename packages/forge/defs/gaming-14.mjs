import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D } from '../src/geo.mjs';

export default {
  category: 'gaming',
  icons: [
    icon('domino', 'Domino', ['dominoes', 'tile game', 'board game', 'pips', 'play'], [body(R(7.5, 3, 9, 18, 2)), line('M7.7 12h8.6'), line(D(10, 6) + D(14, 9) + D(10, 15) + D(14, 15) + D(10, 18) + D(14, 18))], { noAccent: true }),
    icon('suit-spade', 'Spade', ['cards', 'poker', 'card suit', 'casino', 'spades'], [body('M12 3.5c3 3 7 5.5 7 9a3.5 3.5 0 0 1-6 2.5l.8 4.5h-3.6l.8-4.5A3.5 3.5 0 0 1 5 12.5c0-3.5 4-6 7-9Z')], { noAccent: true }),
    icon('spinning-top', 'Spinning Top', ['top', 'toy', 'spin', 'whirligig', 'play'], [line('M12 9V3.5'), body('M4 10c0-.5.5-1 1-1h14c.5 0 1 .5 1 1 0 3-3 7-8 10.5C7 17 4 13 4 10Z')], { noAccent: true, anim: 'wiggle' }),
    icon('slingshot', 'Slingshot', ['catapult', 'toy', 'aim', 'kids', 'game'], [line('M12 20.5V13M12 13 7.5 5M12 13l4.5-8M7.5 5c1.5 3.5 7.5 3.5 9 0')], { noAccent: true }),
    icon('toy-brick', 'Toy Brick', ['building block', 'construction toy', 'kids', 'build', 'stud'], [body(R(6, 7, 4, 3, 1) + R(14, 7, 4, 3, 1)), body(R(3.5, 10, 17, 9.5, 1.5), { cover: true })], { noAccent: true }),
  ],
};
