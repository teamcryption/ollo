const Z = `{ noAccent: true }`;
const CUR = `body(scaleD(poly([[5, 4], [19, 10.5], [12.6, 12.6], [10.5, 19]], 1.2, true), 0.75, 5, 4))`;
const M = {
  search: `body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')`,
  clock: `body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')`,
  gear: `body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))`,
  lock: `line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })`,
  star: `body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })`,
  help: `body(C(17, 16.5, 4), { cover: true }), line('M15.8 15.6a1.3 1.3 0 1 1 1.8 1.2c-.4.2-.6.5-.6.9M17 19.2h.01')`,
  ban: `body(C(17, 16.5, 4), { cover: true }), line('M14.4 13.9l5.2 5.2')`,
};
const T = (a) => a.map((t) => `'${t}'`).join(', ');
const cur = (m, name, title, tags) => `icon('${name}', '${title}', [${T(tags)}, 'cursor', 'pointer'], [${CUR}, ${M[m]}], ${Z})`;
const FIELD = `body(R(3, 8, 18, 8, 2.5))`;
export default {
  interface: [
    cur('search', 'cursor-zoom', 'Zoom Cursor', ['magnify', 'zoom in', 'inspect']),
    cur('clock', 'cursor-wait', 'Busy Cursor', ['loading', 'wait', 'busy']),
    cur('gear', 'cursor-gear', 'Pointer Settings', ['mouse settings', 'pointer options', 'configure']),
    cur('lock', 'cursor-lock', 'Locked Pointer', ['pointer lock', 'disabled', 'restricted']),
    cur('star', 'cursor-star', 'Favourite Click', ['highlight', 'featured', 'click']),
    cur('help', 'cursor-help', 'Help Cursor', ['what is this', 'question', 'help']),
    cur('ban', 'cursor-not-allowed', 'Not Allowed Cursor', ['forbidden', 'disabled', 'no drop']),
    `icon('cursor-col-resize', 'Column Resize', ['resize column', 'drag width', 'cursor', 'splitter', 'table'], [line('M12 5v14'), line('M9 12H4.5M6.3 10.2 4.5 12l1.8 1.8M15 12h4.5M17.7 10.2l1.8 1.8-1.8 1.8')], ${Z})`,
    `icon('textarea', 'Text Area', ['multiline input', 'comment box', 'form field', 'text input', 'ui'], [body(R(3.5, 5, 17, 14, 2.5)), line('M7 9h10M7 12h10'), line('M15 16.8l2-2M17.3 16.8l.2-.2')], ${Z})`,
    `icon('toggle-group', 'Toggle Group', ['segmented control', 'button group', 'options', 'tabs', 'ui'], [body(R(3, 8, 18, 8, 4)), line('M9 8.2v7.6M15 8.2v7.6')], ${Z})`,
    `icon('context-menu', 'Context Menu', ['right click menu', 'options', 'popup menu', 'actions', 'ui'], [body(scaleD(poly([[5, 4], [19, 10.5], [12.6, 12.6], [10.5, 19]], 1.2, true), 0.45, 4, 3.5)), body(R(9, 7, 11.5, 13, 2)), line('M11.5 10.5h6.5M11.5 13.5h6.5M11.5 16.5h4')], ${Z})`,
    `icon('dropdown-menu', 'Dropdown Menu', ['select', 'options list', 'picker', 'menu', 'ui'], [body(R(4, 3.5, 16, 5, 1.5)), line('M15.5 5.4l1.2 1.2 1.2-1.2'), body(R(4, 10, 16, 10.5, 1.5)), line('M6.5 13h8M6.5 16.5h6')], ${Z})`,
    `icon('toolbar', 'Toolbar', ['tool bar', 'actions bar', 'buttons', 'editor', 'ui'], [body(R(3, 8, 18, 8, 2)), line(D(7, 12) + D(10.5, 12) + D(14, 12)), line('M16.5 9.8v4.4')], ${Z})`,
    `icon('dock', 'Dock', ['app dock', 'launcher', 'taskbar', 'desktop', 'apps'], [body(R(3, 14, 18, 6, 2.5)), line(R(5.5, 15.8, 2.5, 2.5, 0.6) + R(9.5, 15.8, 2.5, 2.5, 0.6) + R(13.5, 15.8, 2.5, 2.5, 0.6)), line('M12 4v6M9.5 7.5 12 10l2.5-2.5')], ${Z})`,
    `icon('form', 'Form', ['input form', 'fields', 'sign up form', 'survey', 'ui'], [body(R(4, 3, 16, 18, 2.5)), line(R(7, 6.5, 10, 3, 0.8) + R(7, 11.5, 10, 3, 0.8)), body(R(7, 16.5, 5, 2, 1))], ${Z})`,
    `icon('checkbox-group', 'Checkbox Group', ['checkboxes', 'multiple choice', 'options', 'form', 'ui'], [line(R(4, 5, 5, 5, 1.2) + R(4, 14, 5, 5, 1.2)), line('M5.2 7.6l1 1 1.7-2'), line('M12 7.5h8M12 16.5h6')], ${Z})`,
    `icon('file-input', 'File Input', ['upload field', 'attach file', 'browse', 'form', 'ui'], [${FIELD}, line('M15 8.2v7.6'), line('M18 13.8v-3.6M16.6 11.6 18 10.2l1.4 1.4'), line('M6 12h5.5')], ${Z})`,
    `icon('tag-input', 'Tag Input', ['chips input', 'labels', 'tokens', 'form', 'ui'], [body(R(3, 7, 18, 10, 2.5)), line(R(5.5, 9.5, 5.5, 5, 1.5) + R(12.5, 9.5, 4, 5, 1.5))], ${Z})`,
    `icon('color-input', 'Color Input', ['colour field', 'swatch', 'picker', 'form', 'ui'], [${FIELD}, body(R(5.5, 10, 4, 4, 1)), line('M12 12h5.5')], ${Z})`,
    `icon('time-input', 'Time Input', ['time field', 'clock', 'picker', 'form', 'ui'], [${FIELD}, line(C(7.5, 12, 2) + 'M7.5 11v1.2l.8.5'), line('M12 12h5.5')], ${Z})`,
    `icon('progress-steps', 'Progress Steps', ['stepper', 'wizard', 'onboarding', 'checkout steps', 'ui'], [body(C(5, 12, 2)), body(C(12, 12, 2)), line(C(19, 12, 2)), line('M7.3 12h2.4M14.3 12h2.4')], ${Z})`,
  ],
};
