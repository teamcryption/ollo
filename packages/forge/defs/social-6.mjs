import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D } from '../src/geo.mjs';

const HEART = 'M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z';
const BUBBLE = 'M12 4c4.4 0 8 3 8 6.8s-3.6 6.7-8 6.7c-.9 0-1.8-.1-2.6-.4L5 19.5l.9-3.6C4.7 14.7 4 12.8 4 10.8 4 7 7.6 4 12 4Z';

export default {
  category: 'social',
  icons: [
    icon('news-feed', 'News Feed', ['feed', 'timeline', 'posts', 'updates', 'social feed'], [body(R(4, 3, 16, 11.5, 2.5)), line('M7 11.5l3-3 2.5 2.5 1.5-1.5 3 2.5'), accent(D(15.5, 6.5)), body(R(4, 17, 16, 4, 1.5)), line('M7.5 19h6')]),
    icon('heart-crack', 'Broken Heart', ['heartbreak', 'unlike', 'breakup', 'sad', 'unfollow'], [body(HEART), line('M12 7.7l-1.4 3.4 2.8 2.1-1.6 3.3')], { noAccent: true, anim: 'wiggle' }),
    icon('comment-thread', 'Comment Thread', ['replies', 'discussion', 'thread', 'conversation', 'nested comments'], [body(R(3, 3.5, 13, 8.5, 2.5)), line('M6.5 7.75h6'), line('M6 12v3a2 2 0 0 0 2 2'), body(R(8, 13, 13, 7.5, 2.5)), accent('M11.5 16.75h6')]),
    icon('comment-mention', 'Mention', ['tag someone', 'at mention', 'reply', 'notify', 'username'], [body(BUBBLE), line(C(12, 10.8, 1.5)), line('M13.5 9.6v2c0 1 .6 1.7 1.4 1.7s1.4-.9 1.4-2.5a4.3 4.3 0 1 0-1.7 3.4')], { noAccent: true }),
  ],
};
