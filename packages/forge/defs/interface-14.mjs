import { icon, body, line } from '../src/dsl.mjs';
import { R, C, D, poly } from '../src/geo.mjs';

const LENS = [body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')];
const DOWN = [line('M18 11v8'), line(poly([[15.5, 16.5], [18, 19], [20.5, 16.5]], 0.5))];

export default {
  category: 'interface',
  icons: [
    icon('chart-search', 'Analytics Search', ['search data', 'find insights', 'query', 'explore data', 'analytics'], [body(R(3, 11, 3, 7, 1)), body(R(7.5, 7, 3, 11, 1)), body(R(12, 4, 3, 6.5, 1)), ...LENS], { noAccent: true }),
    icon('message-search', 'Search Messages', ['find chat', 'search conversation', 'inbox search', 'chat history', 'lookup'], [body('M5.5 4h9A2.5 2.5 0 0 1 17 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3A2.5 2.5 0 0 1 3 10.5v-4A2.5 2.5 0 0 1 5.5 4Z'), ...LENS], { noAccent: true }),
    icon('cloud-search', 'Cloud Search', ['search storage', 'find in cloud', 'drive search', 'online files', 'lookup'], [body('M6.5 15a3.5 3.5 0 0 1-.4-7 5 5 0 0 1 9.6 1.1A3 3 0 0 1 15.5 15Z'), ...LENS], { noAccent: true }),
    icon('tag-search', 'Tag Search', ['find label', 'filter by tag', 'search tags', 'category', 'lookup'], [body('M3 4.5A1.5 1.5 0 0 1 4.5 3h4.8a1.5 1.5 0 0 1 1.1.4l5 5a1.5 1.5 0 0 1 0 2.2l-4.6 4.6a1.5 1.5 0 0 1-2.2 0l-5-5A1.5 1.5 0 0 1 3 9.1Z'), line(D(6.5, 6.5)), ...LENS], { noAccent: true }),
    icon('book-download', 'Ebook Download', ['ebook', 'download book', 'offline reading', 'library', 'save'], [body(R(3, 4, 11, 15, 2)), line('M6 4.2v14.6'), ...DOWN], { noAccent: true }),
    icon('map-download', 'Offline Map', ['download map', 'offline navigation', 'save map', 'travel', 'maps'], [body(poly([[3, 6.5], [6.3, 5], [9.7, 6.5], [13, 5], [13, 18], [9.7, 19.5], [6.3, 18], [3, 19.5]], 0.8, true)), line('M6.3 5.2v12.6M9.7 6.7v12.6'), ...DOWN], { noAccent: true }),
  ],
};
