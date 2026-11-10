import { icon, body, line } from '../src/dsl.mjs';
import { R, C, D, poly, star } from '../src/geo.mjs';

const LENS = [body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')];
const CLOCK = [body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')];
const STAR = [body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })];
const DOWN = [line('M18 11v8'), line(poly([[15.5, 16.5], [18, 19], [20.5, 16.5]], 0.5))];
const UP = [line('M18 19v-8'), line(poly([[15.5, 13.5], [18, 11], [20.5, 13.5]], 0.5))];
const VID = [body(R(3, 4, 14, 11.5, 2)), line(poly([[8, 7.2], [11.5, 9.7], [8, 12.2]], 0.5, true))];
const CARD = [body(R(3, 5, 15, 10, 2)), line('M3.2 8.5h14.6')];
const HOME = [body(poly([[3, 10.5], [9.5, 4.5], [16, 10.5], [16, 18.5], [3, 18.5]], 1, true))];
const NOTE = [body(R(3.5, 3.5, 12, 15, 2)), line('M6.5 7.5h6M6.5 10.5h6M6.5 13.5h3')];
const BARS = [body(R(3, 11, 3, 7, 1)), body(R(7.5, 7, 3, 11, 1)), body(R(12, 4, 3, 6.5, 1))];
const DB = [body('M3 6.5c0-1.7 2.5-3 5.5-3s5.5 1.3 5.5 3v10c0 1.7-2.5 3-5.5 3S3 18.2 3 16.5Z'), line('M3.2 6.5c0 1.6 2.4 2.8 5.3 2.8s5.3-1.2 5.3-2.8M3.2 11.5c0 1.6 2.4 2.8 5.3 2.8s5.3-1.2 5.3-2.8')];
const ID = [body(R(3, 5, 15, 11, 2)), line(C(7.5, 9.5, 1.5)), line('M5.3 13.5a2.4 2.4 0 0 1 4.4 0M11.5 9h3.5')];

export default {
  category: 'interface',
  icons: [
    icon('video-star', 'Favourite Video', ['starred video', 'top pick', 'highlight', 'favourites', 'watch later'], [...VID, ...STAR], { noAccent: true }),
    icon('card-star', 'Rewards Card', ['loyalty', 'points', 'premium card', 'membership', 'perks'], [...CARD, ...STAR], { noAccent: true }),
    icon('home-star', 'Favourite Home', ['saved listing', 'dream home', 'shortlist', 'real estate', 'favourites'], [...HOME, ...STAR], { noAccent: true }),
    icon('note-star', 'Starred Note', ['important note', 'pinned note', 'key idea', 'favourites', 'memo'], [...NOTE, ...STAR], { noAccent: true }),
    icon('chart-clock', 'Time Series', ['history', 'trend over time', 'historical data', 'analytics', 'timeline'], [...BARS, ...CLOCK], { noAccent: true }),
    icon('database-clock', 'Backup Schedule', ['scheduled backup', 'snapshot', 'retention', 'database', 'restore point'], [...DB, ...CLOCK], { noAccent: true }),
    icon('cart-search', 'Product Search', ['find product', 'shop search', 'browse store', 'catalogue', 'shopping'], [line('M3 4.5h1.8l1.8 8.5h6.2l1.2-5.5H5.6'), line(D(7, 16.5) + D(11.5, 16.5)), ...LENS], { noAccent: true }),
    icon('id-search', 'Background Check', ['identity check', 'verify id', 'kyc', 'screening', 'lookup'], [...ID, ...LENS], { noAccent: true }),
    icon('chart-download', 'Export Report', ['download report', 'export chart', 'analytics export', 'csv', 'save'], [...BARS, ...DOWN], { noAccent: true, variants: [{ name: 'chart-upload', title: 'Import Data', tags: ['upload data', 'import chart', 'load report', 'csv import', 'analytics'], els: [...BARS, ...UP] }] }),
  ],
};
