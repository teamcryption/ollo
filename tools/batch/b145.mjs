const Z = `{ noAccent: true }`;
const F = `body(R(3.5, 4.5, 17, 15, 2.5))`;
const AXIS = `line('M3.5 3.5v15a2 2 0 0 0 2 2h15')`;
const T = (a) => a.map((t) => `'${t}'`).join(', ');
const lay = (name, title, tags, inner) => `icon('${name}', '${title}', [${T(tags)}, 'layout', 'ui'], [${F}, ${inner}], ${Z})`;
export default {
  interface: [
    lay('layout-columns-2', 'Two Columns', ['columns', 'split view', 'grid'], `line('M12 4.7v14.6')`),
    lay('layout-columns-3', 'Three Columns', ['columns', 'grid', 'sections'], `line('M9.2 4.7v14.6M14.8 4.7v14.6')`),
    lay('layout-rows-2', 'Two Rows', ['rows', 'split horizontal', 'stack'], `line('M3.7 12h16.6')`),
    lay('layout-rows-3', 'Three Rows', ['rows', 'sections', 'stack'], `line('M3.7 9.5h16.6M3.7 14.5h16.6')`),
    lay('layout-cards', 'Card Layout', ['cards', 'tiles', 'grid view'], `line(R(6, 7.5, 5, 9, 1) + R(13, 7.5, 5, 9, 1))`),
    lay('layout-gallery', 'Gallery Layout', ['gallery', 'slideshow', 'thumbnails'], `line(R(6, 7, 12, 7, 1)), line(D(8, 16.5) + D(12, 16.5) + D(16, 16.5))`),
    lay('layout-hero', 'Hero Section', ['hero', 'landing page', 'banner'], `line('M3.7 13h16.6M7 8h6M7 10.2h3.5')`),
    lay('layout-drawer', 'Side Drawer', ['drawer', 'side panel', 'menu'], `line('M14 4.7v14.6M16 9h2M16 12h2')`),
    lay('layout-centered', 'Centered Layout', ['centered', 'focus', 'content'], `line(R(8, 8, 8, 8, 1))`),
    lay('layout-grid', 'Grid Layout', ['grid', 'table', 'nine'], `line('M9.2 4.7v14.6M14.8 4.7v14.6M3.7 9.5h16.6M3.7 14.5h16.6')`),
    lay('layout-feed', 'Feed Layout', ['feed', 'posts', 'list view'], `line(R(6.5, 7, 11, 4, 1) + R(6.5, 13, 11, 4, 1))`),
    lay('layout-timeline', 'Timeline Layout', ['timeline', 'history', 'events'], `line('M8 7v10M10.5 8.5h6M10.5 12h6M10.5 15.5h4')`),
    lay('layout-carousel', 'Carousel', ['slider', 'slides', 'swipe'], `line(R(7.5, 7.5, 9, 9, 1)), line('M5.5 9.5v5M18.5 9.5v5')`),
    `icon('layout-tabs', 'Tabs Layout', ['tabs', 'tabbed', 'navigation', 'layout', 'ui'], [body('M3.5 9.5V6.5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3h6.5a2.5 2.5 0 0 1 2.5 2.5v5a2.5 2.5 0 0 1-2.5 2.5H6a2.5 2.5 0 0 1-2.5-2.5Z'), line('M13.5 7h5')], ${Z})`,
    `icon('window-minimize', 'Minimize Window', ['minimise', 'window', 'hide', 'desktop', 'app'], [${F}, line('M3.7 8.5h16.6'), accent(L(9, 15, 15, 15))])`,
    `icon('window-maximize', 'Maximize Window', ['maximise', 'window', 'fullscreen', 'desktop', 'app'], [${F}, line('M3.7 8.5h16.6'), accent(R(9, 11.5, 6, 5, 0.8))])`,
    `icon('window-restore', 'Restore Window', ['restore down', 'windows', 'overlap', 'desktop', 'app'], [line('M8 4.5h10a2.5 2.5 0 0 1 2.5 2.5v8'), body(R(3.5, 8, 13, 11.5, 2.5), { cover: true }), line('M3.7 11.5h12.6')], ${Z})`,
  ],
  text: [
    `icon('highlight-text', 'Highlight Text', ['highlighter', 'marker', 'emphasis', 'text', 'format'], [line('M14 4.5l4 4-6 6H8v-4Z'), line('M4 20h16')], ${Z})`,
    `icon('uppercase', 'Uppercase', ['all caps', 'capitals', 'case', 'text', 'format'], [line('M3.5 17 7 7l3.5 10M4.7 13.5h4.6M13.5 17 17 7l3.5 10M14.7 13.5h4.6')], ${Z})`,
    `icon('sentence-case', 'Sentence Case', ['capitalise', 'case', 'Aa', 'text', 'format'], [line('M3.5 17 7 7l3.5 10M4.7 13.5h4.6'), line(C(16, 14.5, 2.5)), line('M18.5 12v5')], ${Z})`,
  ],
  data: [
    `icon('chart-spline', 'Spline Chart', ['smooth line', 'curve chart', 'trend', 'graph', 'analytics'], [${AXIS}, line('M7 15c2-6 4-6 5.5-2s3.5 3 5.5-5')], ${Z})`,
    `icon('chart-area-stacked', 'Stacked Area', ['area chart', 'layers', 'cumulative', 'graph', 'analytics'], [${AXIS}, line('M7 16l3-4 3 2 5-6M7 16l3-2 3 1 5-3')], ${Z})`,
    `icon('chart-growth', 'Growth Chart', ['growth', 'increase', 'progress', 'revenue', 'up'], [body(R(5, 14, 3, 6, 0.8)), body(R(10, 11, 3, 9, 0.8)), body(R(15, 7.5, 3, 12.5, 0.8)), accent('M5 9.5l4-3 3 2 4.5-4.5M14 3.8h2.5v2.5')])`,
    `icon('chart-decline', 'Decline Chart', ['decrease', 'loss', 'drop', 'revenue', 'down'], [body(R(5, 7.5, 3, 12.5, 0.8)), body(R(10, 11, 3, 9, 0.8)), body(R(15, 14, 3, 6, 0.8)), accent('M5 4.3l4.5 3 3-2 4.5 4.2M17 7v2.5h-2.5')])`,
    `icon('chart-sankey', 'Sankey Diagram', ['flow chart', 'sankey', 'distribution', 'graph', 'analytics'], [line('M3.5 5v14M20.5 5v14'), line('M4 7c6 0 8 10 16 10M4 12c6 0 8-5 16-5M4 17c8 0 8-5 16-5')], ${Z})`,
  ],
  devices: [
    `icon('screen-rotate', 'Rotate Screen', ['auto rotate', 'orientation', 'landscape', 'portrait', 'phone'], [body(R(8, 5, 8, 14, 2)), accent('M4 9a8 8 0 0 1 3-4.5M5.5 3.5 7 4.5 6 6M20 15a8 8 0 0 1-3 4.5M18.5 20.5 17 19.5l1-1.5')])`,
    `icon('tablet-landscape', 'Tablet Landscape', ['ipad', 'landscape', 'device', 'screen', 'horizontal'], [body(R(3, 5.5, 18, 13, 2.5)), line(D(18.5, 12))], ${Z})`,
  ],
  media: [
    `icon('playback-speed', 'Playback Speed', ['speed', 'faster', 'tempo', 'video', 'audio'], [line('M4.5 16a7.5 7.5 0 0 1 15 0'), body(poly([[10.5, 10.5], [14.5, 13], [10.5, 15.5]], 0.6, true)), accent('M4.5 19.5h15')])`,
    `icon('repeat-one', 'Repeat One', ['loop track', 'repeat song', 'music', 'playback', 'single'], [line('M5.5 11V9.5a2 2 0 0 1 2-2H17M15 5l2.5 2.5L15 10M18.5 13v1.5a2 2 0 0 1-2 2H7M9 19l-2.5-2.5L9 14'), accent('M11.2 11.3l1-.8v4')])`,
  ],
};
