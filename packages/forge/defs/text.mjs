import { R, C, L, poly, D, translateD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

// Text glyphs are pure marks, so this category is exempt from the floating-accent rule.
const rows = (ys, x0, x1) => ys.map((y, i) => line(L(x0[i] ?? x0[0], y, x1[i] ?? x1[0], y)));
const TWO = 'M15 6.4a1.5 1.5 0 1 1 2.6 1.1L15 10.5h3';
const X = [line(L(4.5, 7, 12, 17)), line(L(12, 7, 4.5, 17))];

export default {
  category: 'text',
  icons: [
    icon('bold', 'Bold', ['bold', 'strong', 'weight', 'format', 'text'], [line('M7.5 4.5h5.5a3.5 3.5 0 0 1 0 7H7.5Z'), line('M7.5 11.5h6.5a4 4 0 0 1 0 8H7.5Z')]),
    icon('italic', 'Italic', ['italic', 'slant', 'emphasis', 'format', 'text'], [line(L(10, 4.5, 17, 4.5)), line(L(7, 19.5, 14, 19.5)), line(L(14, 4.5, 10, 19.5))]),
    icon('underline', 'Underline', ['underline', 'format', 'text', 'style'], [line('M7 4v6.5a5 5 0 0 0 10 0V4'), line(L(5.5, 20, 18.5, 20))]),
    icon('strikethrough', 'Strikethrough', ['strike', 'delete', 'format', 'text', 'cross out'], [line('M16.5 7a4.4 4.4 0 0 0-4.3-2.5C9.8 4.5 8 5.8 8 7.8c0 1.4.9 2.4 2.6 3'), line('M8 16.5c.6 1.8 2.3 3 4.5 3 2.6 0 4.5-1.4 4.5-3.5 0-.8-.3-1.5-.8-2'), line(L(4.5, 12, 19.5, 12))]),
    icon('heading', 'Heading', ['title', 'header', 'h1', 'format', 'text'], [line(L(6, 4.5, 6, 19.5)), line(L(18, 4.5, 18, 19.5)), line(L(6, 12, 18, 12))]),
    icon('type', 'Text', ['type', 'font', 'letter', 'typography', 'text'], [line('M5 7.5V5h14v2.5'), line(L(12, 5, 12, 19.5)), line(L(9.5, 19.5, 14.5, 19.5))]),
    icon('text-size', 'Text Size', ['font size', 'scale', 'typography', 'resize'], [line('M3.5 7V5h10v2'), line(L(8.5, 5, 8.5, 19)), line('M13.5 12.5v-1.5h7v1.5'), line(L(17, 11, 17, 19))]),
    icon('font', 'Font', ['typeface', 'typography', 'letters', 'aa', 'text'], [line('M3.5 19 8 5l4.5 14'), line(L(5.3, 14, 10.7, 14)), line(C(17.2, 16, 3)), line(L(20.2, 12.5, 20.2, 19))]),
    icon('text-align-left', 'Align Left', ['align', 'paragraph', 'left', 'text', 'format'], rows([6, 10, 14, 18], [4], [20, 14, 20, 14]), {
      mirror: { name: 'text-align-right', title: 'Align Right', tags: ['align', 'paragraph', 'right', 'text', 'format'] },
      variants: [
        { name: 'text-align-center', title: 'Align Center', tags: ['align', 'paragraph', 'centre', 'center'], els: [...rows([6, 14], [4], [20]), ...rows([10, 18], [7], [17])] },
        { name: 'text-align-justify', title: 'Justify', tags: ['align', 'paragraph', 'justify', 'block'], els: rows([6, 10, 14, 18], [4], [20]) },
      ],
    }),
    icon('list-numbered', 'Numbered List', ['ordered', 'numbers', 'list', 'steps'], [line(L(10, 6.5, 20, 6.5)), line(L(10, 17.5, 20, 17.5)), line('M4.2 5 5.6 4v5'), line('M4 15.3a1.4 1.4 0 1 1 2.4 1L4 19.5h2.6')]),
    icon('list-check', 'Checklist', ['todo', 'tasks', 'check', 'list'], [line(poly([[3.8, 6.6], [5.1, 7.9], [7.4, 5.3]], 0.3)), line(poly([[3.8, 17.6], [5.1, 18.9], [7.4, 16.3]], 0.3)), line(L(10.5, 6.5, 20, 6.5)), line(L(10.5, 17.5, 20, 17.5))]),
    icon('quote', 'Quote', ['quotation', 'blockquote', 'citation', 'testimonial'], [body(C(7.5, 14.5, 2.5)), line('M5 14.5c0-3.5 1.5-6 4.5-7'), body(C(16, 14.5, 2.5)), line('M13.5 14.5c0-3.5 1.5-6 4.5-7')]),
    icon('indent', 'Indent', ['indent', 'increase', 'tab', 'paragraph'], [line(L(4, 5, 20, 5)), line(L(11, 9.5, 20, 9.5)), line(L(11, 14.5, 20, 14.5)), line(L(4, 19, 20, 19)), line(poly([[4, 9.5], [6.5, 12], [4, 14.5]], 0.4))], {
      variants: [{ name: 'outdent', title: 'Outdent', tags: ['outdent', 'decrease', 'paragraph'], els: [line(L(4, 5, 20, 5)), line(L(11, 9.5, 20, 9.5)), line(L(11, 14.5, 20, 14.5)), line(L(4, 19, 20, 19)), line(poly([[6.5, 9.5], [4, 12], [6.5, 14.5]], 0.4))] }],
    }),
    icon('pilcrow', 'Paragraph', ['paragraph', 'pilcrow', 'formatting marks', 'text'], [body('M11 4.5H9.5a4 4 0 0 0 0 8H11Z'), line(L(11, 4.5, 11, 19.5)), line(L(15.5, 4.5, 15.5, 19.5)), line(L(11, 4.5, 18, 4.5))]),
    icon('superscript', 'Superscript', ['exponent', 'power', 'superscript', 'format'], [...X, line(TWO)], {
      variants: [{ name: 'subscript', title: 'Subscript', tags: ['subscript', 'index', 'chemistry', 'format'], els: [...X, line(translateD(TWO, 0, 9))] }],
    }),
    icon('text-wrap', 'Text Wrap', ['wrap', 'line break', 'paragraph', 'flow'], [line(L(4, 6, 20, 6)), line('M4 12h12.5a3 3 0 0 1 0 6H12'), line(poly([[14, 16], [12, 18], [14, 20]], 0.4)), line(L(4, 18, 8.5, 18))]),
  ],
};
