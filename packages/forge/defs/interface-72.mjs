import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'interface',
  icons: [
    icon('menu-2', 'Menu Alt', ['hamburger', 'navigation', 'lines', 'drawer'], [line(L(4, 6, 20, 6)), line(L(4, 12, 15, 12)), line(L(4, 18, 20, 18)), accent(L(18, 12, 20, 12))]),
    icon('menu-3', 'Menu Short', ['hamburger', 'navigation', 'lines', 'compact'], [line(L(4, 8, 20, 8)), line(L(4, 16, 13, 16)), accent(L(16, 16, 20, 16))]),
    icon('menu-4', 'Menu Left', ['hamburger', 'navigation', 'lines', 'left aligned'], [line(L(4, 6, 20, 6)), line(L(4, 12, 16, 12)), accent(L(4, 18, 10, 18))]),
    icon('menu-5', 'Menu Rounded', ['hamburger', 'navigation', 'drawer', 'rounded'], [body(R(3, 4, 18, 16, 4)), line(L(7.5, 9, 16.5, 9)), line(L(7.5, 12, 16.5, 12)), accent(L(7.5, 15, 12, 15))]),
    icon('home-2', 'Home Alt', ['house', 'main', 'start', 'dashboard'], [line('M3.5 11 12 4l8.5 7'), body(R(6, 10, 12, 10.5, 1.5)), accent(L(10.5, 16, 13.5, 16))]),
    icon('home-3', 'Home Chimney', ['house', 'main', 'start', 'chimney'], [body('M4 11 12 4.5 20 11v8.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5Z'), line('M16.5 7.2V4'), accent(L(10, 16.5, 14, 16.5))]),
    icon('home-4', 'Home Arch', ['house', 'main', 'start', 'door'], [body('M4 20V11.5a2 2 0 0 1 .8-1.6l6-4.5a2 2 0 0 1 2.4 0l6 4.5a2 2 0 0 1 .8 1.6V20Z'), line('M10 20v-4a2 2 0 0 1 4 0v4'), accent(L(8, 12.5, 9.5, 12.5))]),
    icon('settings-2', 'Settings Sliders', ['preferences', 'controls', 'adjust', 'options'], [line('M4 7h9M17 7h3M4 17h3M11 17h9'), line(C(15, 7, 2)), line(C(9, 17, 2)), accent(L(4, 12, 9, 12))]),
    icon('settings-3', 'Settings Cog', ['preferences', 'gear', 'options', 'configure'], [body(gear(12, 12, 8.5, 6.5, 6, 0.45)), line(C(12, 12, 2.5)), accent(L(18.5, 3.5, 20, 5))]),
    icon('search-2', 'Search Alt', ['find', 'lookup', 'magnifier', 'explore'], [line(C(10.5, 10.5, 6.5)), line(L(15.5, 15.5, 20, 20)), accent('M7.5 9.5a3.2 3.2 0 0 1 2.5-2.4')]),
    icon('star-2', 'Star Rounded', ['favorite', 'rating', 'bookmark', 'featured'], [body(star(12, 12.5, 9, 4.2, 5, 1.6)), accent(L(18.5, 4, 20, 5.5))]),
  ],
};
