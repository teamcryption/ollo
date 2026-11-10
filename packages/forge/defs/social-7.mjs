import { icon, body, line } from '../src/dsl.mjs';
import { C, A, D } from '../src/geo.mjs';

const BUBBLE = 'M12 4c4.4 0 8 3 8 6.8s-3.6 6.7-8 6.7c-.9 0-1.8-.1-2.6-.4L5 19.5l.9-3.6C4.7 14.7 4 12.8 4 10.8 4 7 7.6 4 12 4Z';

export default {
  category: 'social',
  icons: [
    icon('story-ring', 'Story Ring', ['stories', 'new story', 'status ring', 'profile story', 'unseen'], [body(C(12, 12, 6)), line(C(12, 10.2, 2)), line('M8.8 16.2a3.6 3.6 0 0 1 6.4 0'), line(A(12, 12, 8.5, -80, -10) + A(12, 12, 8.5, 10, 80) + A(12, 12, 8.5, 100, 170) + A(12, 12, 8.5, 190, 260))], { noAccent: true }),
    icon('comment-smile', 'Friendly Comment', ['emoji reply', 'happy comment', 'reaction', 'positive feedback', 'chat smile'], [body(BUBBLE), line(D(9.8, 9.3) + D(14.2, 9.3)), line(A(12, 10.8, 3, 30, 150))], { noAccent: true }),
  ],
};
