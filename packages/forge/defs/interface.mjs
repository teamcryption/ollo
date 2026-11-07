import { R, C, L, A, poly, gear, head, star, rotateD, D } from '../src/geo.mjs';
import { icon, body, line, accent, tint } from '../src/dsl.mjs';

const dots = (pts, r = 0.9) => pts.map(([x, y]) => body(C(x, y, r)));

export default {
  category: 'interface',
  icons: [
    icon('menu', 'Menu', ['hamburger', 'navigation', 'lines', 'drawer'], [line(L(4, 7, 20, 7)), line(L(4, 12, 20, 12)), accent(L(4, 17, 13, 17))], { anim: 'pop-draw' }),
    icon('menu-right', 'Menu Right', ['hamburger', 'align right', 'lines', 'drawer'], [line(L(4, 7, 20, 7)), line(L(4, 12, 20, 12)), accent(L(11, 17, 20, 17))]),
    icon('dashboard', 'Dashboard', ['grid', 'apps', 'layout', 'tiles', 'overview'], [body(R(4, 4, 7, 7, 2)), body(R(13, 4, 7, 7, 2)), body(R(4, 13, 7, 7, 2)), body(C(16.5, 16.5, 3.5))]),
    icon('layout-sidebar', 'Sidebar', ['layout', 'panel', 'columns', 'window'], [body(R(3.5, 4.5, 17, 15, 2.5)), line(L(9.5, 4.7, 9.5, 19.3)), accent(L(13, 9, 17, 9))]),
    icon('list', 'List', ['items', 'bullets', 'rows', 'menu'], [...dots([[5, 7], [5, 12]]), body(C(5, 17, 0.9)), line(L(9, 7, 20, 7)), line(L(9, 12, 20, 12)), accent(L(9, 17, 15, 17))]),
    icon('settings', 'Settings', ['gear', 'cog', 'preferences', 'options', 'configure'], [body(gear(12, 12, 8.6, 6.6, 8, 0.8)), accent(C(12, 12, 2.6))], { anim: 'spin', badges: ['check', 'alert'] }),
    icon('sliders', 'Sliders', ['adjust', 'controls', 'filter', 'tune', 'mixer'], [line(L(4, 8, 8.5, 8)), line(L(14.5, 8, 20, 8)), body(C(11.5, 8, 2.2)), line(L(4, 16, 11, 16)), line(L(17, 16, 20, 16)), body(C(14, 16, 2.2))]),
    icon('filter', 'Filter', ['funnel', 'sort', 'refine', 'narrow'], [body(poly([[4, 5], [20, 5], [14, 12.5], [14, 19], [10, 17], [10, 12.5]], 1.2, true)), accent(L(9.5, 8.2, 14.5, 8.2))], { badges: ['add', 'remove', 'close'] }),
    icon('info', 'Info', ['information', 'about', 'details', 'help'], [body(C(12, 12, 8.5)), accent(L(12, 11, 12, 16)), line(D(12, 8))], { anim: 'pulse' }),
    icon('warning', 'Warning', ['alert', 'caution', 'danger', 'triangle', 'error'], [body(poly([[12, 3.8], [21, 19.5], [3, 19.5]], 2.6, true)), accent(L(12, 10, 12, 14)), line(D(12, 16.6))], { anim: 'wiggle' }),
    icon('help', 'Help', ['question', 'support', 'faq', 'unknown'], [body(C(12, 12, 8.5)), accent('M9.6 9.6a2.4 2.4 0 1 1 3.3 2.25c-.55.25-.9.75-.9 1.35v.5'), line(D(12, 16.4))], { anim: 'pulse' }),
    icon('check-circle', 'Check Circle', ['done', 'success', 'complete', 'approved', 'tick'], [body(C(12, 12, 8.5)), accent(poly([[8.5, 12.2], [11, 14.6], [15.5, 9.8]], 0.6))]),
    icon('close-circle', 'Close Circle', ['cancel', 'remove', 'error', 'delete', 'x'], [body(C(12, 12, 8.5)), line(L(9.6, 9.6, 14.4, 14.4)), line(L(14.4, 9.6, 9.6, 14.4))]),
    icon('add-circle', 'Add Circle', ['plus', 'new', 'create', 'insert'], [body(C(12, 12, 8.5)), line(L(8.5, 12, 15.5, 12)), line(L(12, 8.5, 12, 15.5))]),
    icon('remove-circle', 'Remove Circle', ['minus', 'subtract', 'delete', 'less'], [body(C(12, 12, 8.5)), accent(L(8.5, 12, 15.5, 12))]),
    icon('more-horizontal', 'More', ['dots', 'ellipsis', 'options', 'overflow', 'menu'], dots([[6, 12], [12, 12], [18, 12]], 1.2)),
    icon('more-vertical', 'More Vertical', ['dots', 'ellipsis', 'options', 'kebab', 'menu'], dots([[12, 6], [12, 12], [12, 18]], 1.2)),
    icon('eye', 'Eye', ['view', 'visible', 'show', 'watch', 'preview'], [body('M3 12c2.2-4.2 5.4-6.5 9-6.5s6.8 2.3 9 6.5c-2.2 4.2-5.4 6.5-9 6.5S5.2 16.2 3 12Z'), accent(C(12, 12, 2.6))]),
    icon('eye-off', 'Eye Off', ['hide', 'hidden', 'invisible', 'private'], [body('M3 12c2.2-4.2 5.4-6.5 9-6.5s6.8 2.3 9 6.5c-2.2 4.2-5.4 6.5-9 6.5S5.2 16.2 3 12Z'), line(C(12, 12, 2.6)), line(L(4.5, 4.5, 19.5, 19.5), { cover: true })]),
    icon('link', 'Link', ['chain', 'url', 'hyperlink', 'connect', 'attach'], [line(rotateD('M10 9H7.5a3 3 0 0 0 0 6H10', -45)), line(rotateD('M14 9h2.5a3 3 0 0 1 0 6H14', -45)), accent(rotateD(L(9.5, 12, 14.5, 12), -45))]),
    icon('external-link', 'External Link', ['open', 'new window', 'launch', 'redirect'], [line('M11 5H7.5A2.5 2.5 0 0 0 5 7.5v9A2.5 2.5 0 0 0 7.5 19h9a2.5 2.5 0 0 0 2.5-2.5V13'), line(L(12.5, 11.5, 18.5, 5.5)), line(poly([[14.5, 5], [19, 5], [19, 9.5]], 0.8))], { anim: { preset: 'nudge', dir: [0.7, -0.7], dist: 1.5 } }),
    icon('copy', 'Copy', ['duplicate', 'clone', 'clipboard', 'paste'], [body(R(4, 4, 11, 11, 2.5)), body(R(9, 9, 11, 11, 2.5), { cover: true }), accent(L(12, 14.5, 17, 14.5))]),
    icon('trash', 'Trash', ['delete', 'bin', 'remove', 'garbage', 'discard'], [line(L(4.5, 6.5, 19.5, 6.5)), line('M9.5 6.5V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5v1'), body('M6.5 9h11l-.75 9.1A2.1 2.1 0 0 1 14.66 20H9.34a2.1 2.1 0 0 1-2.09-1.9Z'), line(L(10, 12.5, 10, 16.5)), accent(L(14, 12.5, 14, 16.5))], { anim: 'wiggle' }),
    icon('edit', 'Edit', ['pencil', 'write', 'modify', 'compose', 'rename'], [body('M15.3 4.7a2.2 2.2 0 0 1 3.1 0l.9.9a2.2 2.2 0 0 1 0 3.1L9.5 18.5 5 19.5l1-4.5Z'), accent(L(13, 20, 19, 20))], { anim: 'wiggle' }),
    icon('download', 'Download', ['save', 'arrow down', 'import', 'get'], [line('M4 15v2.5A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5V15'), line(L(12, 4, 12, 13.5)), line(head(12, 14, 90, 4))], { anim: { preset: 'bounce', dist: 2.5 } }),
    icon('upload', 'Upload', ['send', 'arrow up', 'export', 'share'], [line('M4 15v2.5A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5V15'), line(L(12, 14.5, 12, 5)), line(head(12, 4.5, -90, 4))], { anim: { preset: 'bounce', dist: -2.5 } }),
    icon('share', 'Share', ['network', 'connect', 'send', 'social'], [body(C(17, 6, 2.5)), body(C(7, 12, 2.5)), body(C(17, 18, 2.5)), line(L(9.3, 10.7, 14.7, 7.3)), line(L(9.3, 13.3, 14.7, 16.7))]),
    icon('power', 'Power', ['on', 'off', 'shutdown', 'turn off', 'switch'], [line(A(12, 12, 7.5, -55, 235)), accent(L(12, 4, 12, 10.5))], { anim: 'pulse' }),
    icon('toggle-on', 'Toggle On', ['switch', 'enabled', 'active', 'on'], [body(R(3, 7, 18, 10, 5)), accent(C(16, 12, 2.6))], { variants: [{ name: 'toggle-off', title: 'Toggle Off', tags: ['switch', 'disabled', 'inactive', 'off'], els: [body(R(3, 7, 18, 10, 5)), accent(C(8, 12, 2.6))] }] }),
    icon('maximize', 'Maximize', ['fullscreen', 'expand', 'enlarge', 'grow'], [line('M4 9V6.5A2.5 2.5 0 0 1 6.5 4H9'), line('M15 4h2.5A2.5 2.5 0 0 1 20 6.5V9'), line('M20 15v2.5a2.5 2.5 0 0 1-2.5 2.5H15'), line('M9 20H6.5A2.5 2.5 0 0 1 4 17.5V15'), accent(R(10, 10, 4, 4, 1.2))], { anim: 'pulse' }),
    icon('pin', 'Location Pin', ['map', 'marker', 'place', 'location', 'gps'], [body('M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z'), accent(C(12, 10, 2.4))], { anim: { preset: 'bounce', dist: -2.5 }, badges: ['add', 'remove', 'check'] }),
    icon('star', 'Star', ['favourite', 'favorite', 'rating', 'bookmark', 'rate'], [body(star(12, 12.4, 9, 4.3, 5, 1.4))], { anim: 'pulse' }),
    icon('bookmark', 'Bookmark', ['save', 'favourite', 'tag', 'read later'], [body(poly([[6.5, 3.5], [17.5, 3.5], [17.5, 20], [12, 16.4], [6.5, 20]], 2, true)), accent(L(9.5, 7.5, 14.5, 7.5))], { badges: ['add', 'remove', 'check'] }),
    icon('flag', 'Flag', ['report', 'mark', 'milestone', 'country'], [line(L(5, 21, 5, 4)), body(poly([[7.5, 4.5], [19, 4.5], [16, 8.5], [19, 12.5], [7.5, 12.5]], 1.2, true))], { anim: 'wiggle' }),
    icon('home-smart', 'Home Hub', ['home', 'house', 'hub', 'start', 'dashboard'], [body(poly([[4.5, 10.2], [12, 4], [19.5, 10.2], [19.5, 20], [4.5, 20]], 2.2, true)), accent(A(12, 16.5, 2.4, 200, 340))]),
    icon('loader', 'Loader', ['loading', 'spinner', 'progress', 'wait', 'busy'], [line(A(12, 12, 7.5, -90, 150)), accent(A(12, 12, 7.5, 185, 240))], { anim: 'spin' }),
    icon('zoom-in', 'Zoom In', ['magnify', 'enlarge', 'plus', 'scale'], [body(C(10.5, 10.5, 6.5)), line(L(15.5, 15.5, 20, 20)), line(L(8, 10.5, 13, 10.5)), line(L(10.5, 8, 10.5, 13))], { variants: [{ name: 'zoom-out', title: 'Zoom Out', tags: ['minify', 'shrink', 'minus', 'scale'], els: [body(C(10.5, 10.5, 6.5)), line(L(15.5, 15.5, 20, 20)), accent(L(8, 10.5, 13, 10.5))] }] }),
    icon('command', 'Command', ['cmd', 'keyboard', 'shortcut', 'mac'], [line('M9 9V7a2 2 0 1 0-2 2h10a2 2 0 1 0-2-2v10a2 2 0 1 0 2-2H7a2 2 0 1 0 2 2Z'), accent(L(11, 12, 13, 12))]),
    icon('cursor', 'Cursor', ['pointer', 'mouse', 'click', 'select', 'arrow'], [body(poly([[5, 4], [19, 10.5], [12.6, 12.6], [10.5, 19]], 1.2, true)), accent(L(15.5, 15.5, 19, 19))], { anim: { preset: 'nudge', dir: [-0.6, -0.6], dist: 1.5 } }),
    icon('sparkle', 'Sparkle', ['magic', 'ai', 'new', 'shine', 'stars'], [body('M11 4c.6 3.7 1.9 5.7 6 6.5-4.1.8-5.4 2.8-6 6.5-.6-3.7-1.9-5.7-6-6.5 4.1-.8 5.4-2.8 6-6.5Z'), line(L(18, 15.5, 18, 19.5)), line(L(16, 17.5, 20, 17.5))], { anim: 'pulse' }),
    icon('grid-dots', 'Drag Handle', ['grip', 'drag', 'move', 'reorder', 'handle'], dots([[9, 6], [15, 6], [9, 12], [15, 12], [9, 18], [15, 18]], 1.1)),
    icon('window', 'Window', ['browser', 'app', 'screen', 'frame'], [body(R(3.5, 4.5, 17, 15, 2.5)), line(L(3.7, 9, 20.3, 9)), accent(L(10, 14.5, 14, 14.5))], { badges: ['add', 'close'] }),
    tintless(),
  ],
};

// A shape that only exists to show off the tint rule: a target with a soft disc in Duotone.
function tintless() {
  return icon('target', 'Target', ['goal', 'aim', 'focus', 'bullseye'], [line(C(12, 12, 8.5)), tint(C(12, 12, 5)), line(C(12, 12, 5)), accent(C(12, 12, 1.5))], { anim: 'pulse' });
}
