import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'text',
  icons: [
    icon('highlighter', 'Highlighter', ['highlight', 'marker', 'emphasis', 'annotate'], [body(poly([[13.5, 3.5], [20.5, 10.5], [13, 18], [10, 18], [6, 14], [6, 11]], 0.8, true)), line(L(9.2, 7.8, 16.2, 14.8)), line(L(4.5, 20.5, 8, 17)), accent(L(12.5, 20.5, 20, 20.5))]),
    icon('text-color', 'Text Colour', ['font colour', 'letter', 'colour', 'format'], [line(poly([[6.5, 16], [12, 3.5], [17.5, 16]], 0.5)), line(L(8.6, 11.5, 15.4, 11.5)), accent(L(4, 20, 20, 20))]),
    icon('spell-check', 'Spell Check', ['spelling', 'proofread', 'grammar', 'correct'], [line(poly([[4, 13], [8, 3.5], [12, 13]], 0.4)), line(L(5.5, 9.8, 10.5, 9.8)), accent(poly([[11.5, 16.5], [14.5, 19.5], [20, 13]], 0.6))]),
    icon('translate', 'Translate', ['language', 'localise', 'i18n', 'interpret'], [line('M3.5 6h8M7.5 3.5V6M10 6c-1 4-3.5 6.5-6 7.5M6 9c1.2 2 3 3.5 5 4'), line(poly([[12, 20.5], [16.5, 10], [21, 20.5]], 0.4)), line(L(13.6, 17, 19.4, 17))], { noAccent: true }),
    icon('text-cursor', 'Text Cursor', ['caret', 'i-beam', 'typing', 'insert'], [line('M9 4h1.5A1.5 1.5 0 0 1 12 5.5v13a1.5 1.5 0 0 1-1.5 1.5H9'), line('M15 4h-1.5A1.5 1.5 0 0 0 12 5.5v13a1.5 1.5 0 0 0 1.5 1.5H15'), line(L(10, 12, 14, 12))], { noAccent: true, anim: 'pulse' }),
    icon('line-height', 'Line Height', ['leading', 'spacing', 'line spacing', 'paragraph'], [line('M5 5v14M3 7l2-2 2 2M3 17l2 2 2-2'), line(L(10, 6, 20.5, 6)), accent(L(10, 12, 17, 12)), line(L(10, 18, 20.5, 18))]),
    icon('letter-spacing', 'Letter Spacing', ['tracking', 'kerning', 'spacing', 'characters'], [line(poly([[7, 13], [12, 3.5], [17, 13]], 0.5)), line(L(8.8, 9.6, 15.2, 9.6)), accent('M4 18.5h16M6 16.5l-2 2 2 2M18 16.5l2 2-2 2')]),
    icon('text-box', 'Text Box', ['text field', 'text frame', 'caption', 'label'], [body(R(3.5, 3.5, 17, 17, 2.5)), line('M8 8h8M12 8v8.5')], { noAccent: true }),
  ],
};
