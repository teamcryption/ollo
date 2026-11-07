import { R, C, L, A, poly, D, head, star } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'actions',
  icons: [
    icon('plus', 'Plus', ['add', 'new', 'create', 'more'], [line(L(12, 5, 12, 19)), line(L(5, 12, 19, 12))], { noAccent: true, anim: 'spin' }),
    icon('minus', 'Minus', ['remove', 'subtract', 'less', 'collapse'], [line(L(5, 12, 19, 12))], { noAccent: true, anim: 'pulse' }),
    icon('close', 'Close', ['x', 'cancel', 'dismiss', 'exit', 'delete'], [line(L(6.5, 6.5, 17.5, 17.5)), line(L(17.5, 6.5, 6.5, 17.5))], { noAccent: true, anim: 'spin' }),
    icon('check', 'Check', ['done', 'tick', 'confirm', 'ok', 'complete'], [line(poly([[5, 12.5], [9.5, 17], [19, 7.5]], 1))], { noAccent: true, anim: 'pop-draw' }),
    icon('save', 'Save', ['floppy', 'disk', 'store', 'keep'], [body('M4 6.5A2.5 2.5 0 0 1 6.5 4h9.5L20 8v9.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5Z'), line('M8 19.8V15a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v4.8'), accent(L(8.5, 7.5, 13, 7.5))], { anim: { preset: 'bounce', dist: 1.5 } }),
    icon('print', 'Print', ['printer', 'document', 'paper', 'output'], [line('M7 8.3V5a1.5 1.5 0 0 1 1.5-1.5h7A1.5 1.5 0 0 1 17 5v3.3'), body(R(3.5, 8.5, 17, 8.5, 2.5)), body(R(7, 13.5, 10, 7, 1.5), { cover: true }), accent(D(17, 11.5))]),
    icon('scissors', 'Scissors', ['cut', 'trim', 'clip', 'snip'], [line(L(8.4, 15.7, 17, 4.5)), line(L(15.6, 15.7, 7, 4.5)), body(C(6.5, 17.5, 2.5)), body(C(17.5, 17.5, 2.5))], { noAccent: true, anim: 'wiggle' }),
    icon('reply', 'Reply', ['respond', 'answer', 'back', 'message'], [line(poly([[9.5, 6.5], [4.5, 11], [9.5, 15.5]], 0.8)), line('M5 11h9a5.5 5.5 0 0 1 5.5 5.5v1')], { noAccent: true, mirror: { name: 'forward', title: 'Forward', tags: ['send on', 'share', 'pass', 'message'] }, anim: { preset: 'nudge', dir: [-1, 0], dist: 1.5 } }),
    icon('pushpin', 'Pushpin', ['pin', 'attach', 'stick', 'keep on top'], [body('M9 3.5h6l-.8 5.2 3.3 3.3v1.5h-11V12l3.3-3.3Z'), line(L(12, 13.8, 12, 20.5))], { noAccent: true, anim: { preset: 'bounce', dist: -2 } }),
    icon('logout', 'Log Out', ['sign out', 'exit', 'leave', 'quit'], [line('M10 4.5H7A2.5 2.5 0 0 0 4.5 7v10A2.5 2.5 0 0 0 7 19.5h3'), line(L(10.5, 12, 19, 12)), line(head(19.5, 12, 0, 3.5))], { noAccent: true, variants: [{ name: 'login', title: 'Log In', tags: ['sign in', 'enter', 'access', 'account'], els: [line('M14 4.5h3A2.5 2.5 0 0 1 19.5 7v10a2.5 2.5 0 0 1-2.5 2.5h-3'), line(L(4.5, 12, 13.5, 12)), line(head(14, 12, 0, 3.5))], noAccent: true }], anim: { preset: 'nudge', dir: [1, 0], dist: 1.5 } }),
    icon('lightbulb', 'Lightbulb', ['idea', 'tip', 'insight', 'innovation', 'hint'], [body('M9.2 16.5v-1.3c0-.9-.5-1.6-1.2-2.3a5.6 5.6 0 1 1 8 0c-.7.7-1.2 1.4-1.2 2.3v1.3Z'), line(L(9.5, 19.5, 14.5, 19.5)), accent(A(12, 9.5, 2.8, 200, 260))], { anim: 'pulse' }),
    icon('magic-wand', 'Magic Wand', ['magic', 'auto', 'enhance', 'ai', 'transform'], [line(L(4, 20, 13.5, 10.5)), body(star(16.5, 7.5, 3.4, 1.4, 4, 0.5)), accent(D(20.3, 13)), line(D(10.5, 4.5))], { anim: 'wiggle' }),
    icon('share-arrow', 'Share Out', ['export', 'send', 'share', 'upload'], [line('M8 9.5H7a2.5 2.5 0 0 0-2.5 2.5v5.5A2.5 2.5 0 0 0 7 20h10a2.5 2.5 0 0 0 2.5-2.5V12A2.5 2.5 0 0 0 17 9.5h-1'), line(L(12, 14, 12, 4.5)), line(head(12, 4, -90, 3.5))], { noAccent: true, anim: { preset: 'bounce', dist: -2 } }),
    icon('refresh-square', 'Sync', ['sync', 'update', 'reload', 'refresh'], [body(R(3.5, 3.5, 17, 17, 4)), line(A(12, 12, 4.3, 200, 340)), line(poly([[14.3, 7.6], [16.3, 8.4], [15.8, 10.4]], 0.4)), accent(A(12, 12, 4.3, 20, 160))], { anim: 'spin' }),
  ],
};
