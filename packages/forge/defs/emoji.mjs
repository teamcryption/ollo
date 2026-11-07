import { R, C, L, D, E, poly, rotateD } from '../src/geo.mjs';
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
        face('face-love', 'Love', ['heart eyes', 'adore', 'crush', 'in love'], [line('M9 11.5 7.4 10a1 1 0 0 1 1.6-1.3 1 1 0 0 1 1.6 1.3Z'), line('M15 11.5 13.4 10a1 1 0 0 1 1.6-1.3 1 1 0 0 1 1.6 1.3Z'), accent('M8.5 14.5a4 4 0 0 0 7 0')]),
        face('face-tongue', 'Tongue Out', ['silly', 'playful', 'cheeky', 'tongue'], [...EYES, accent('M8.5 14h7M10.5 14v1.5a1.5 1.5 0 0 0 3 0V14')]),
        face('face-cry', 'Crying', ['cry', 'tears', 'upset', 'sob'], [...EYES, line('M15 12.3s-1 1.2-1 1.8a1 1 0 0 0 2 0c0-.6-1-1.8-1-1.8Z'), accent('M8 17a4 4 0 0 1 6 0')]),
        face('face-confused', 'Confused', ['confused', 'unsure', 'puzzled', 'hmm'], [...EYES, accent('M8.5 15.5c1-1 2-1 3.5 0s2.5 1 3.5 0')]),
        face('face-dizzy', 'Dizzy', ['dizzy', 'dead', 'knocked out', 'ko'], [line('M7.8 8.8l2.4 2.4m0-2.4-2.4 2.4'), line('M13.8 8.8l2.4 2.4m0-2.4-2.4 2.4'), accent(C(12, 15.5, 1.5))]),
        face('face-kiss', 'Kiss', ['kiss', 'love', 'smooch', 'affection'], [...EYES, accent('M11 13.3c1.6 0 1.6 1.6 0 1.6 1.6 0 1.6 1.6 0 1.6')]),
      ],
    }),
      icon('ghost', 'Ghost', ['halloween', 'spooky', 'boo', 'spirit'], [body('M5.5 11a6.5 6.5 0 0 1 13 0v9.5l-2.2-1.5-2.1 1.5-2.2-1.5-2.2 1.5-2.1-1.5-2.2 1.5Z'), line(D(9.5, 10.5)), line(D(14.5, 10.5)), accent(C(12, 14.5, 1.2))], { anim: 'wiggle' }),
    icon('skull', 'Skull', ['danger', 'death', 'poison', 'pirate', 'halloween'], [body('M12 3.5a7.5 7.5 0 0 0-4.5 13.5v2.5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V17A7.5 7.5 0 0 0 12 3.5Z'), line(C(9, 11, 1.6)), line(C(15, 11, 1.6)), accent(poly([[12, 13.6], [11, 15.4], [13, 15.4]], 0.2, true)), line(L(10.5, 18, 10.5, 20.3)), line(L(13.5, 18, 13.5, 20.3))]),
    icon('alien', 'Alien', ['ufo', 'extraterrestrial', 'space', 'martian'], [body('M12 3.5c4.5 0 7.5 3 7.5 7 0 4.5-4 10-7.5 10s-7.5-5.5-7.5-10c0-4 3-7 7.5-7Z'), line(rotateD(E(8.8, 11.2, 2.4, 1.3), 30, 8.8, 11.2)), line(rotateD(E(15.2, 11.2, 2.4, 1.3), -30, 15.2, 11.2)), accent(L(11, 16.5, 13, 16.5))]),
  ],
};
