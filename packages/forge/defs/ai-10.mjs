import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, poly, star, scaleD, translateD } from '../src/geo.mjs';

const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));
const HEART = 'M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z';

export default {
  category: 'ai',
  icons: [
    icon('ai-cart', 'AI Shopping', ['smart cart', 'ai commerce', 'recommendations', 'personal shopper', 'checkout ai'], [line('M3 5h2l2 10h8.5l1.6-6.5H6.4'), body(C(8, 18.5, 1.5)), body(C(15, 18.5, 1.5)), spark(19.5, 4.5, 2)], { anim: 'pulse' }),
    icon('ai-bag', 'AI Stylist', ['smart shopping', 'ai picks', 'retail ai', 'personalised', 'bag'], [line('M7 8V6.5a2.5 2.5 0 0 1 5 0V8'), body(poly([[4, 8], [15, 8], [16, 20.5], [3, 20.5]], 1, true)), spark(19, 5, 2.2)], { anim: 'pulse' }),
    icon('ai-map', 'AI Route', ['smart route', 'ai navigation', 'trip planner', 'map ai', 'directions'], [body(poly([[3, 6.5], [6.8, 5], [10.7, 6.5], [14.5, 5], [14.5, 19], [10.7, 20.5], [6.8, 19], [3, 20.5]], 0.8, true)), line('M6.8 5.2v13.6M10.7 6.7v13.6'), spark(19, 5.5, 2)], { anim: 'pulse' }),
    icon('ai-heart', 'AI Health', ['health ai', 'wellness', 'smart care', 'diagnosis', 'medical ai'], [body(translateD(scaleD(HEART, 0.8), -1.5, 1.5)), spark(19, 5.5, 2.2)], { anim: 'pulse' }),
    icon('ai-home', 'Smart Home AI', ['home assistant', 'automation', 'smart house', 'ai home', 'iot'], [body(poly([[3, 11], [9.5, 5], [16, 11], [16, 20.5], [3, 20.5]], 1, true)), line('M8 20.3v-4h3v4'), spark(19.5, 5, 2)], { anim: 'pulse' }),
    icon('ai-news', 'AI News', ['news digest', 'briefing', 'ai summary news', 'headlines', 'feed'], [body(R(3, 6, 13, 14, 2)), line('M6 10h7M6 13h7M6 16h4'), spark(19, 5, 2.2)], { anim: 'pulse' }),
    icon('ai-target', 'AI Goals', ['smart targeting', 'objective', 'ai focus', 'precision', 'aim'], [body(C(10, 13, 6.5)), line(C(10, 13, 3.2)), spark(18.5, 5, 2.2)], { anim: 'pulse' }),
    icon('ai-key', 'AI Access', ['api key', 'ai credentials', 'model key', 'unlock ai', 'token'], [body(C(8, 9, 4)), line(C(8, 9, 1.5)), line('M10.8 11.8 17 18M14.5 15.5 16 14M16.5 17.5 18 16'), spark(19, 5, 2.2)], { anim: 'pulse' }),
  ],
};
