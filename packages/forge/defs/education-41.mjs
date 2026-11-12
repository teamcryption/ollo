import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'education',
  icons: [
    icon('notebook-upload', 'Upload Notebook', ['upload', 'send', 'export', 'notebook', 'notebook'], [body(R(5, 3.5, 10, 15, 1.5)), line('M3.5 6.5h3M3.5 10.5h3M3.5 14.5h3'), line('M8.5 7h4'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('books-upload', 'Upload Books', ['upload', 'send', 'export', 'books', 'books'], [body(R(4, 5, 2.5, 12, 0.6)), body(R(7.5, 4, 2.5, 13, 0.6)), body(poly([[11, 6], [13.3, 5.4], [15.8, 16.4], [13.5, 17]], 0.5, true)), line('M3.5 18.5h12'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('whiteboard-upload', 'Upload Whiteboard', ['upload', 'send', 'export', 'whiteboard', 'whiteboard'], [body(R(3, 3.5, 13, 9, 1.2)), line('M5.5 7l2-1.3 2 1.8 2.5-2.5'), line('M6.5 12.7 5 18M12.5 12.7 14 18'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('ruler-triangle-upload', 'Upload Set Square', ['upload', 'send', 'export', 'set square', 'ruler-triangle'], [body(poly([[4, 4], [4, 17], [16, 17]], 0.6, true)), line('M7 11.5v3h3Z'), line('M4.2 7h1.5M4.2 10h1.5M4.2 13h1.5'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('eraser-upload', 'Upload Eraser', ['upload', 'send', 'export', 'eraser', 'eraser'], [body(rotateD(R(4, 7.5, 11, 6, 1.5), -35, 9.5, 10.5)), line(rotateD('M8.5 7.7v5.6', -35, 9.5, 10.5)), line('M4.5 18h10'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('globe-stand-upload', 'Upload Globe', ['upload', 'send', 'export', 'globe', 'globe-stand'], [line(C(9.5, 8, 5)), line('M4.5 8h10M9.5 3.2c-2 3-2 6.6 0 9.6'), line('M14.5 12a7 7 0 0 1-9.5 1.5M9.5 14.5v3M6.5 18h6'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('bookshelf-upload', 'Upload Bookshelf', ['upload', 'send', 'export', 'bookshelf', 'bookshelf'], [body(R(3.5, 3.5, 12, 15, 1)), line('M3.7 10.5h11.6'), line('M6 4v6.3M8 4v6.3M11 4.5l1.5 5.8M6 11v7.3M8.5 11v7.3'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('test-paper-upload', 'Upload Exam', ['upload', 'send', 'export', 'exam', 'test-paper'], [body(R(4.5, 3.5, 10, 14.5, 1.5)), line('M7 7.5l1 1 2-2M11.5 7.5h1M7 11.5l1 1 2-2M11.5 11.5h1M7 15h5'), body(poly([[17, 12.3], [20.8, 16.3], [18.5, 16.3], [18.5, 20.5], [15.5, 20.5], [15.5, 16.3], [13.2, 16.3]], 0.5, true), { cover: true })], { noAccent: true }),
  ],
};
