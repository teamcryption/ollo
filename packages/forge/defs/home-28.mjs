import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, rotateD } from '../src/geo.mjs';

const rot = (els, deg) => els.map((e) => ({ ...e, d: rotateD(e.d, deg) }));

export default {
  category: 'home',
  icons: [
    icon('bottle-opener', 'Bottle Opener', ['opener', 'beer', 'bar tool', 'cap lifter', 'kitchen'], [body('M12 3.5a4.5 4.5 0 0 1 4.5 4.5c0 1.8-1 3.1-2 4V19a2.5 2.5 0 0 1-5 0v-7c-1-.9-2-2.2-2-4A4.5 4.5 0 0 1 12 3.5Z'), line(R(10.5, 6.5, 3, 3.5, 1.2))], { noAccent: true }),
    icon('jam-jar', 'Jam Jar', ['preserves', 'jar', 'marmalade', 'pantry', 'mason jar'], [body(R(6.5, 4, 11, 3, 1)), body(R(5.5, 9.2, 13, 11.3, 3)), line(R(8, 12.5, 8, 5, 1))], { noAccent: true }),
    icon('candle-holder', 'Candle Holder', ['candlestick', 'candle', 'cosy', 'candlelight', 'decor'], [accent('M12 2.8c1 1 1.5 1.8 1.5 2.5a1.5 1.5 0 0 1-3 0c0-.7.5-1.5 1.5-2.5Z'), body(R(10, 8.8, 4, 8.5, 1)), body('M5 17.3h14a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3Z', { cover: true })]),
  ],
};
