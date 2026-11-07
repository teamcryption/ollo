import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const FIELD = R(3, 7, 18, 10, 2.5);

export default {
  category: 'interface',
  icons: [
    icon('checkbox', 'Checkbox', ['tick box', 'option', 'form', 'unchecked'], [body(R(4, 4, 16, 16, 3.5))], { noAccent: true }),
    icon('dropdown', 'Dropdown', ['select', 'combo box', 'menu', 'picker', 'form'], [body(FIELD), line(L(6.5, 12, 11, 12)), accent(poly([[14.5, 10.8], [16, 12.3], [17.5, 10.8]], 0.4))]),
    icon('text-input', 'Text Field', ['input', 'form field', 'textbox', 'entry'], [body(FIELD), accent(L(7, 10, 7, 14)), line(L(9.5, 12, 14, 12))]),
    icon('search-bar', 'Search Bar', ['search field', 'find', 'query', 'lookup'], [body(R(3, 7, 18, 10, 5)), line(C(8, 11.6, 2)), line(L(9.5, 13.1, 10.6, 14.2)), accent(L(13, 12, 17, 12))]),
    icon('modal', 'Modal', ['dialog', 'popup', 'overlay', 'lightbox'], [line(R(3, 3.5, 18, 17, 2.5)), body(R(6.5, 8, 11, 8, 1.5)), accent(L(9, 11, 13, 11))]),
    icon('split-view', 'Split View', ['side by side', 'compare', 'two panes', 'divide'], [body(R(3, 4, 18, 16, 2.5)), line(L(12, 4.2, 12, 19.8)), accent(L(5.5, 8, 9.5, 8)), line(L(14.5, 8, 18.5, 8))]),
    icon('pagination', 'Pagination', ['pages', 'carousel dots', 'slides', 'step'], [line(D(5.5, 12)), line(D(9.5, 12)), accent(L(13.5, 12, 18.5, 12))]),
    icon('carousel', 'Carousel', ['slider', 'gallery', 'slideshow', 'swipe'], [line(L(4, 7, 4, 17)), body(R(7, 5, 10, 14, 2)), line(L(20, 7, 20, 17))], { noAccent: true }),
    icon('accordion', 'Accordion', ['collapse', 'expand', 'sections', 'faq'], [body(R(3, 3.5, 18, 4, 1.5)), line(R(3, 9.5, 18, 6, 1.5)), accent(L(6, 12.5, 13, 12.5)), body(R(3, 17.5, 18, 3.5, 1.5))]),
    icon('progress-bar', 'Progress Bar', ['progress', 'loading', 'completion', 'status'], [line(R(3, 9, 18, 6, 3)), accent(L(6, 12, 13, 12))]),
    icon('notification-dot', 'Notification Dot', ['unread', 'badge', 'new', 'indicator'], [body(R(3.5, 8, 12.5, 12.5, 3)), accent(C(18.5, 5.5, 2))]),
    icon('chip', 'Chip', ['tag', 'pill', 'token', 'filter chip'], [body(R(3, 7.5, 18, 9, 4.5)), line(C(7.5, 12, 2)), accent('M15 10.5l3 3m0-3-3 3')]),
    icon('toast', 'Toast', ['snackbar', 'notification', 'message', 'alert bar'], [line(R(3, 3.5, 18, 17, 2.5)), body(R(5.5, 13.5, 13, 4.5, 1.5))], { noAccent: true }),
    icon('grip-vertical', 'Drag Handle', ['drag', 'reorder', 'grip', 'move', 'handle'], [line(D(9, 6)), line(D(15, 6)), line(D(9, 12)), line(D(15, 12)), line(D(9, 18)), line(D(15, 18))], { noAccent: true }),
    icon('picture-in-picture', 'Picture in Picture', ['pip', 'mini player', 'floating video', 'overlay'], [body(R(3, 4, 18, 16, 2.5)), accent(R(12, 12, 6, 5, 1))]),
  ],
};
