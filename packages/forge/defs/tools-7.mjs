import { R, L, rotateD, translateD } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'tools',
  icons: [
    icon('axe', 'Axe', ['hatchet', 'chop', 'wood', 'lumberjack', 'camping', 'firewood'], [line(translateD(rotateD(L(12.5, 4, 12.5, 20.5), 35), -1.5, 1.5)), body(translateD(rotateD('M15 4.5H9.5L6 3.5C5 5.8 4.8 8.3 5.5 10.8L9.5 9.2H15Z', 35), -1.5, 1.5))], { noAccent: true }),
    icon('pickaxe', 'Pickaxe', ['mining', 'pick', 'dig', 'quarry', 'excavate'], [line(rotateD(L(12, 7, 12, 20.5), 35)), body(rotateD('M4.5 9.5C6.8 6.3 9.3 4.8 12 4.8s5.2 1.5 7.5 4.7C17 7.8 14.8 7.2 12 7.2s-5 .6-7.5 2.3Z', 35))], { noAccent: true }),
    icon('trowel', 'Trowel', ['garden', 'dig', 'planting', 'gardening', 'soil'], [body(rotateD(R(10.6, 3, 2.8, 5.5, 1.4), 40)), line(rotateD(L(12, 8.5, 12, 10.5), 40)), body(rotateD('M12 10.5h4.5a1.5 1.5 0 0 1 1.5 1.5c0 3.5-3 6.5-6 8.5-3-2-6-5-6-8.5a1.5 1.5 0 0 1 1.5-1.5Z', 40))], { noAccent: true }),
  ],
};
