import { R, C, L, A, poly, D, star } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const HAND = 'M8 10.5l3.4-6a1.8 1.8 0 0 1 3.3 1.3L14 9.5h4.3a2 2 0 0 1 2 2.3l-1.2 6.5a2 2 0 0 1-2 1.7H8Z';

export default {
  category: 'social',
  icons: [
    icon('thumbs-up', 'Thumbs Up', ['like', 'approve', 'agree', 'good', 'upvote'], [body(R(3.5, 10.5, 3, 9.3, 1.2)), body(HAND), accent(L(11, 15, 15.5, 15))], { anim: { preset: 'bounce', dist: -2 }, mirror: { name: 'thumbs-down', title: 'Thumbs Down', tags: ['dislike', 'disapprove', 'bad', 'downvote'], axis: 'y' } }),
    icon('trophy', 'Trophy', ['winner', 'award', 'achievement', 'champion', 'prize'], [body('M7 4h10v5a5 5 0 0 1-10 0Z'), line('M7 6H5.6a1.6 1.6 0 0 0 0 3.2H7'), line('M17 6h1.4a1.6 1.6 0 0 1 0 3.2H17'), line(L(12, 14.2, 12, 17)), accent(L(8.5, 20, 15.5, 20))], { anim: { preset: 'bounce', dist: -2 } }),
    icon('medal', 'Medal', ['award', 'badge', 'achievement', 'reward', 'rank'], [line(L(8, 3.5, 10.6, 9)), line(L(16, 3.5, 13.4, 9)), body(C(12, 15, 5)), accent(star(12, 15.1, 2.6, 1.2, 5, 0.3))], { anim: 'wiggle' }),
    icon('fire', 'Fire', ['trending', 'hot', 'popular', 'flame', 'streak'], [body('M12 21a6 6 0 0 0 6-6c0-4-3-6-4-9.5-1.5 2-2 3.6-2 5.2-1-1-1.5-2-1.5-3.2C8 10 6 12.5 6 15a6 6 0 0 0 6 6Z'), accent('M12 18.5a2 2 0 0 1-2-2c0-1.2 1-2.2 2-3.2')], { anim: 'pulse' }),
    icon('hashtag', 'Hashtag', ['tag', 'topic', 'trend', 'number', 'channel'], [line(L(10, 4, 8, 20)), line(L(16, 4, 14, 20)), line(L(4.5, 9, 19.5, 9)), line(L(4.5, 15, 19.5, 15))], { noAccent: true }),
    icon('heart-plus', 'Add to Favourites', ['favourite', 'save', 'wishlist', 'love'], [body('M12 19.5s-7.5-4.4-7.5-9.6A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.7c0 5.2-7.5 9.6-7.5 9.6Z'), line(L(9.6, 12, 14.4, 12)), line(L(12, 9.6, 12, 14.4))], { anim: 'pulse', noAccent: true }),
    icon('comment-heart', 'Reaction', ['react', 'like', 'comment', 'love'], [body('M7 4.5h10A3 3 0 0 1 20 7.5v7a3 3 0 0 1-3 3h-6l-4 3v-3a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3Z'), accent('M12 14.2s-3-1.8-3-3.9a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 2.1-3 3.9-3 3.9Z')], { anim: 'pulse' }),
    icon('repost', 'Repost', ['retweet', 'share', 'repeat', 'boost'], [line('M5 11V9.5A2.5 2.5 0 0 1 7.5 7H18'), line(poly([[15.5, 4.5], [18, 7], [15.5, 9.5]], 0.6)), line('M19 13v1.5a2.5 2.5 0 0 1-2.5 2.5H6'), line(poly([[8.5, 14.5], [6, 17], [8.5, 19.5]], 0.6))], { noAccent: true, anim: 'spin' }),
    icon('verified', 'Verified', ['badge', 'check', 'official', 'trusted', 'certified'], [body(star(12, 12, 9.3, 7, 8, 1)), accent(poly([[8.8, 12.1], [11, 14.3], [15.2, 10]], 0.6))], { anim: 'spin' }),
  ],
};
