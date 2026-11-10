import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'interface',
  icons: [
    icon('layout-columns-3', 'Three Columns', ['columns', 'grid', 'sections', 'layout', 'ui'], [body(R(3.5, 4.5, 17, 15, 2.5)), line('M9.2 4.7v14.6M14.8 4.7v14.6')], { noAccent: true }),
    icon('layout-rows-2', 'Two Rows', ['rows', 'split horizontal', 'stack', 'layout', 'ui'], [body(R(3.5, 4.5, 17, 15, 2.5)), line('M3.7 12h16.6')], { noAccent: true }),
    icon('layout-rows-3', 'Three Rows', ['rows', 'sections', 'stack', 'layout', 'ui'], [body(R(3.5, 4.5, 17, 15, 2.5)), line('M3.7 9.5h16.6M3.7 14.5h16.6')], { noAccent: true }),
    icon('layout-cards', 'Card Layout', ['cards', 'tiles', 'grid view', 'layout', 'ui'], [body(R(3.5, 4.5, 17, 15, 2.5)), line(R(6, 7.5, 5, 9, 1) + R(13, 7.5, 5, 9, 1))], { noAccent: true }),
    icon('layout-gallery', 'Gallery Layout', ['gallery', 'slideshow', 'thumbnails', 'layout', 'ui'], [body(R(3.5, 4.5, 17, 15, 2.5)), line(R(6, 7, 12, 7, 1)), line(D(8, 16.5) + D(12, 16.5) + D(16, 16.5))], { noAccent: true }),
    icon('layout-hero', 'Hero Section', ['hero', 'landing page', 'banner', 'layout', 'ui'], [body(R(3.5, 4.5, 17, 15, 2.5)), line('M3.7 13h16.6M7 8h6M7 10.2h3.5')], { noAccent: true }),
    icon('layout-drawer', 'Side Drawer', ['drawer', 'side panel', 'menu', 'layout', 'ui'], [body(R(3.5, 4.5, 17, 15, 2.5)), line('M14 4.7v14.6M16 9h2M16 12h2')], { noAccent: true }),
    icon('layout-centered', 'Centered Layout', ['centered', 'focus', 'content', 'layout', 'ui'], [body(R(3.5, 4.5, 17, 15, 2.5)), line(R(8, 8, 8, 8, 1))], { noAccent: true }),
    icon('layout-feed', 'Feed Layout', ['feed', 'posts', 'list view', 'layout', 'ui'], [body(R(3.5, 4.5, 17, 15, 2.5)), line(R(6.5, 7, 11, 4, 1) + R(6.5, 13, 11, 4, 1))], { noAccent: true }),
    icon('layout-timeline', 'Timeline Layout', ['timeline', 'history', 'events', 'layout', 'ui'], [body(R(3.5, 4.5, 17, 15, 2.5)), line('M8 7v10M10.5 8.5h6M10.5 12h6M10.5 15.5h4')], { noAccent: true }),
    icon('layout-carousel', 'Carousel', ['slider', 'slides', 'swipe', 'layout', 'ui'], [body(R(3.5, 4.5, 17, 15, 2.5)), line(R(7.5, 7.5, 9, 9, 1)), line('M5.5 9.5v5M18.5 9.5v5')], { noAccent: true }),
    icon('window-maximize', 'Maximize Window', ['maximise', 'window', 'fullscreen', 'desktop', 'app'], [body(R(3.5, 4.5, 17, 15, 2.5)), line('M3.7 8.5h16.6'), accent(R(9, 11.5, 6, 5, 0.8))]),
    icon('window-restore', 'Restore Window', ['restore down', 'windows', 'overlap', 'desktop', 'app'], [line('M8 4.5h10a2.5 2.5 0 0 1 2.5 2.5v8'), body(R(3.5, 8, 13, 11.5, 2.5), { cover: true }), line('M3.7 11.5h12.6')], { noAccent: true }),
  ],
};
