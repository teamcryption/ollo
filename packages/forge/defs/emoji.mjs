import { R, C, L, D, poly } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

// One face, many expressions: every face is a variant of face-smile so the duplicate check
// treats them as one family.
const HEAD = body(C(12, 12, 8.5));
const EYES = [line(D(9, 10)), line(D(15, 10))];
const face = (name, title, tags, els) => ({ name, title, tags, els: [HEAD, ...els] });

export default {
  category: 'emoji',
  icons: [
    icon('face-smile', 'Smile', ['happy', 'emoji', 'face', 'smiley', 'good'], [HEAD, ...EYES, accent('M8.5 14a4 4 0 0 0 7 0')], {
      anim: { preset: 'bounce', dist: -1.5 },
      variants: [
        face('face-laugh', 'Laugh', ['laugh', 'joy', 'lol', 'funny'], [...EYES, accent('M8 13.5h8a4 4 0 0 1-8 0Z')]),
        face('face-sad', 'Sad', ['sad', 'unhappy', 'down', 'upset'], [...EYES, accent('M8.5 16.5a4 4 0 0 1 7 0')]),
        face('face-neutral', 'Neutral', ['neutral', 'meh', 'indifferent', 'okay'], [...EYES, accent(L(9, 15.5, 15, 15.5))]),
        face('face-wink', 'Wink', ['wink', 'playful', 'flirt', 'joke'], [line('M7.8 10.3a1.6 1.6 0 0 1 2.4 0'), line(D(15, 10)), accent('M8.5 14a4 4 0 0 0 7 0')]),
        face('face-surprised', 'Surprised', ['wow', 'shock', 'amazed', 'surprise'], [...EYES, accent(C(12, 15.3, 1.8))]),
        face('face-angry', 'Angry', ['angry', 'mad', 'annoyed', 'frustrated'], [line(L(7.5, 8, 10, 9)), line(L(16.5, 8, 14, 9)), line(D(9, 11)), line(D(15, 11)), accent('M8.5 16.8a4 4 0 0 1 7 0')]),
        face('face-cool', 'Cool', ['sunglasses', 'cool', 'confident', 'chill'], [line(L(4, 9.5, 20, 9.5)), body(R(6.5, 9.5, 4.5, 3, 1.2)), body(R(13, 9.5, 4.5, 3, 1.2)), accent('M9 15.5a3.6 3.6 0 0 0 6 0')]),
        face('face-sleepy', 'Sleepy', ['tired', 'sleep', 'bored', 'zzz'], [line(L(7.8, 10, 10.2, 10)), line(L(13.8, 10, 16.2, 10)), accent(C(12, 15.3, 1.3))]),
      ],
    }),
  ],
};
