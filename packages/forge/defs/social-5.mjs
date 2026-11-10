import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, L, A, D, star, translateD, scaleD } from '../src/geo.mjs';

const HEART = 'M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z';
const BUBBLE = 'M12 4c4.4 0 8 3 8 6.8s-3.6 6.7-8 6.7c-.9 0-1.8-.1-2.6-.4L5 19.5l.9-3.6C4.7 14.7 4 12.8 4 10.8 4 7 7.6 4 12 4Z';

export default {
  category: 'social',
  icons: [
    icon('heart-burst', 'Heart Burst', ['love reaction', 'like', 'popular', 'viral', 'favourite'], [body(translateD(scaleD(HEART, 0.75), 0, 3)), accent('M12 3.5v2.5M6.5 5.5l1.5 2M17.5 5.5l-1.5 2')], { anim: 'pulse' }),
    icon('sticker', 'Sticker', ['sticker pack', 'emoji sticker', 'peel', 'decal', 'chat sticker'], [body('M7 4h10a3 3 0 0 1 3 3v6l-7 7H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z'), line('M19.8 13.2H16a3 3 0 0 0-3 3v3.8'), line(D(9.5, 7.5) + D(12.5, 7.5)), accent(A(11, 9, 3, 30, 150))]),
    icon('star-rating', 'Star Rating', ['rating', 'review', 'stars', 'score', 'feedback'], [body(star(12, 10, 5, 2.2, 5, 0.6)), body(star(5.5, 15.5, 2.6, 1.15, 5, 0.4)), body(star(18.5, 15.5, 2.6, 1.15, 5, 0.4)), accent(L(8, 20, 16, 20))]),
    icon('comment-star', 'Review', ['testimonial', 'rating', 'feedback', 'comment', 'star review'], [body(BUBBLE), accent(star(12, 10.8, 3.4, 1.5, 5, 0.4))], { anim: 'pulse' }),
    icon('story', 'Story', ['stories', 'status', 'reel', 'vertical video', 'moment'], [body(R(5.5, 3, 13, 18, 3)), line('M8 6.5h2.2M11.4 6.5h2.2M14.8 6.5h1.2'), accent(translateD(scaleD(HEART, 0.35), 0, 1.8))]),
  ],
};
