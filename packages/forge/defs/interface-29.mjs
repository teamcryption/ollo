import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'interface',
  icons: [
    icon('cursor-zoom', 'Zoom Cursor', ['magnify', 'zoom in', 'inspect', 'cursor', 'pointer'], [body(scaleD(poly([[5, 4], [19, 10.5], [12.6, 12.6], [10.5, 19]], 1.2, true), 0.75, 5, 4)), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('cursor-wait', 'Busy Cursor', ['loading', 'wait', 'busy', 'cursor', 'pointer'], [body(scaleD(poly([[5, 4], [19, 10.5], [12.6, 12.6], [10.5, 19]], 1.2, true), 0.75, 5, 4)), body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')], { noAccent: true }),
    icon('cursor-gear', 'Pointer Settings', ['mouse settings', 'pointer options', 'configure', 'cursor', 'pointer'], [body(scaleD(poly([[5, 4], [19, 10.5], [12.6, 12.6], [10.5, 19]], 1.2, true), 0.75, 5, 4)), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('cursor-lock', 'Locked Pointer', ['pointer lock', 'disabled', 'restricted', 'cursor', 'pointer'], [body(scaleD(poly([[5, 4], [19, 10.5], [12.6, 12.6], [10.5, 19]], 1.2, true), 0.75, 5, 4)), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('cursor-star', 'Favourite Click', ['highlight', 'featured', 'click', 'cursor', 'pointer'], [body(scaleD(poly([[5, 4], [19, 10.5], [12.6, 12.6], [10.5, 19]], 1.2, true), 0.75, 5, 4)), body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })], { noAccent: true }),
    icon('cursor-help', 'Help Cursor', ['what is this', 'question', 'help', 'cursor', 'pointer'], [body(scaleD(poly([[5, 4], [19, 10.5], [12.6, 12.6], [10.5, 19]], 1.2, true), 0.75, 5, 4)), body(C(17, 16.5, 4), { cover: true }), line('M15.8 15.6a1.3 1.3 0 1 1 1.8 1.2c-.4.2-.6.5-.6.9M17 19.2h.01')], { noAccent: true }),
    icon('cursor-col-resize', 'Column Resize', ['resize column', 'drag width', 'cursor', 'splitter', 'table'], [line('M12 5v14'), line('M9 12H4.5M6.3 10.2 4.5 12l1.8 1.8M15 12h4.5M17.7 10.2l1.8 1.8-1.8 1.8')], { noAccent: true }),
    icon('textarea', 'Text Area', ['multiline input', 'comment box', 'form field', 'text input', 'ui'], [body(R(3.5, 5, 17, 14, 2.5)), line('M7 9h10M7 12h10'), line('M15 16.8l2-2M17.3 16.8l.2-.2')], { noAccent: true }),
    icon('toggle-group', 'Toggle Group', ['segmented control', 'button group', 'options', 'tabs', 'ui'], [body(R(3, 8, 18, 8, 4)), line('M9 8.2v7.6M15 8.2v7.6')], { noAccent: true }),
    icon('context-menu', 'Context Menu', ['right click menu', 'options', 'popup menu', 'actions', 'ui'], [body(scaleD(poly([[5, 4], [19, 10.5], [12.6, 12.6], [10.5, 19]], 1.2, true), 0.45, 4, 3.5)), body(R(9, 7, 11.5, 13, 2)), line('M11.5 10.5h6.5M11.5 13.5h6.5M11.5 16.5h4')], { noAccent: true }),
    icon('dropdown-menu', 'Dropdown Menu', ['select', 'options list', 'picker', 'menu', 'ui'], [body(R(4, 3.5, 16, 5, 1.5)), line('M15.5 5.4l1.2 1.2 1.2-1.2'), body(R(4, 10, 16, 10.5, 1.5)), line('M6.5 13h8M6.5 16.5h6')], { noAccent: true }),
    icon('dock', 'Dock', ['app dock', 'launcher', 'taskbar', 'desktop', 'apps'], [body(R(3, 14, 18, 6, 2.5)), line(R(5.5, 15.8, 2.5, 2.5, 0.6) + R(9.5, 15.8, 2.5, 2.5, 0.6) + R(13.5, 15.8, 2.5, 2.5, 0.6)), line('M12 4v6M9.5 7.5 12 10l2.5-2.5')], { noAccent: true }),
    icon('form', 'Form', ['input form', 'fields', 'sign up form', 'survey', 'ui'], [body(R(4, 3, 16, 18, 2.5)), line(R(7, 6.5, 10, 3, 0.8) + R(7, 11.5, 10, 3, 0.8)), body(R(7, 16.5, 5, 2, 1))], { noAccent: true }),
    icon('file-input', 'File Input', ['upload field', 'attach file', 'browse', 'form', 'ui'], [body(R(3, 8, 18, 8, 2.5)), line('M15 8.2v7.6'), line('M18 13.8v-3.6M16.6 11.6 18 10.2l1.4 1.4'), line('M6 12h5.5')], { noAccent: true }),
    icon('color-input', 'Color Input', ['colour field', 'swatch', 'picker', 'form', 'ui'], [body(R(3, 8, 18, 8, 2.5)), body(R(5.5, 10, 4, 4, 1)), line('M12 12h5.5')], { noAccent: true }),
  ],
};
