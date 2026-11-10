import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, rotateD } from '../src/geo.mjs';

export default {
  category: 'education',
  icons: [
    icon('flashcards', 'Flashcards', ['study cards', 'revision', 'memorise', 'vocabulary', 'quiz cards'], [body(rotateD(R(6, 4, 14, 10, 2.5), 12, 13, 9)), body(R(3, 9, 14, 10.5, 2.5), { cover: true }), line('M6.5 13h7'), accent('M6.5 16h4')]),
  ],
};
