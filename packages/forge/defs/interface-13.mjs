import { icon, body, line } from '../src/dsl.mjs';
import { R, C, poly } from '../src/geo.mjs';

const LENS = [body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')];

export default {
  category: 'interface',
  icons: [
    icon('video-search', 'Video Search', ['find video', 'search clips', 'media search', 'watch', 'lookup'], [body(R(3, 4, 14, 11.5, 2)), line(poly([[8, 7.2], [11.5, 9.7], [8, 12.2]], 0.5, true)), ...LENS], { noAccent: true }),
    icon('location-search', 'Location Search', ['find place', 'search map', 'nearby', 'address lookup', 'places'], [body('M9.5 18.5s-6-5.2-6-9.6a6 6 0 0 1 12 0c0 1.1-.4 2.3-1 3.4'), line(C(9.5, 8.9, 2)), ...LENS], { noAccent: true }),
    icon('book-search', 'Book Search', ['find book', 'library search', 'catalogue', 'reading', 'lookup'], [body(R(3.5, 3.5, 11, 15, 2)), line('M6.5 3.7v14.6'), ...LENS], { noAccent: true }),
    icon('gift-search', 'Gift Finder', ['gift ideas', 'find present', 'shopping search', 'presents', 'browse gifts'], [body(R(3, 8, 13, 10, 1.5)), line('M9.5 8.2v9.6M3.2 11.5h12.6'), line('M9.5 8C8.5 5.5 6 4.5 5.5 6.3S8 8 9.5 8c1.5 0 4.5-.5 4-1.7S10.5 5.5 9.5 8'), ...LENS], { noAccent: true }),
  ],
};
