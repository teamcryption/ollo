import { icon, body, line } from '../src/dsl.mjs';
import { R, C, D, poly, star } from '../src/geo.mjs';

const LENS = [body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')];
const DOWN = [line('M18 11v8'), line(poly([[15.5, 16.5], [18, 19], [20.5, 16.5]], 0.5))];
const CLOCK = [body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')];
const STAR = [body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })];
const PERSON = [body(C(9, 7.5, 3.3)), body('M3 18.5c.4-2.6 2.9-4.3 6-4.3 1.4 0 2.6.3 3.6.9-1 1-1.6 2.4-1.6 3.9v.5H3.8c-.5 0-.9-.5-.8-1Z')];

export default {
  category: 'interface',
  icons: [
    icon('music-search', 'Music Search', ['find song', 'search tracks', 'song lookup', 'audio search', 'discover'], [line('M9.5 15V5.5l4-1'), body(C(7.5, 15, 2)), ...LENS], { noAccent: true }),
    icon('receipt-search', 'Find Receipt', ['search expenses', 'transaction search', 'purchase history', 'records', 'lookup'], [body(R(4, 3.5, 11, 15, 2)), line('M7 7.5h5M7 10.5h4'), ...LENS], { noAccent: true }),
    icon('code-download', 'Code Download', ['download source', 'clone repo', 'export code', 'sdk', 'developer'], [body(R(3, 4, 12, 15, 2)), line('M7.2 9 5.5 11l1.7 2M10.8 9l1.7 2-1.7 2'), ...DOWN], { noAccent: true }),
    icon('video-clock', 'Scheduled Video', ['premiere', 'scheduled stream', 'upcoming video', 'go live later', 'broadcast'], [body(R(3, 4, 14, 11.5, 2)), line(poly([[8, 7.2], [11.5, 9.7], [8, 12.2]], 0.5, true)), ...CLOCK], { noAccent: true }),
    icon('image-clock', 'Scheduled Post', ['post later', 'social scheduler', 'queued post', 'content calendar', 'publish later'], [body(R(3, 4, 14, 11.5, 2)), line('M5.5 12.5l2.8-2.8 2.2 2.2'), line(D(13, 7.5)), ...CLOCK], { noAccent: true }),
    icon('checklist-clock', 'Task Deadline', ['due task', 'to do deadline', 'timed checklist', 'reminder', 'schedule'], [body(R(3.5, 3.5, 12, 15, 2)), line('M6.5 8l1 1 2-2M6.5 12.5l1 1 2-2'), ...CLOCK], { noAccent: true }),
    icon('folder-star', 'Favourite Folder', ['starred folder', 'pinned', 'important', 'favourites', 'collection'], [body('M3 7A2 2 0 0 1 5 5h3.2l1.8 1.8h4A2 2 0 0 1 16 8.8V16H5a2 2 0 0 1-2-2Z'), ...STAR], { noAccent: true }),
    icon('image-star', 'Favourite Photo', ['starred image', 'best shot', 'highlight', 'favourites', 'gallery'], [body(R(3, 4, 14, 11.5, 2)), line('M5.5 12.5l2.8-2.8 2.2 2.2'), line(D(13, 7.5)), ...STAR], { noAccent: true }),
    icon('mail-star', 'Starred Email', ['important mail', 'flagged', 'priority', 'favourite message', 'inbox'], [body(R(3, 5, 14.5, 11, 2)), line('M5.5 8l4.75 3 4.75-3'), ...STAR], { noAccent: true }),
    icon('user-star', 'VIP User', ['vip', 'featured member', 'top fan', 'premium user', 'favourite contact'], [...PERSON, ...STAR], { noAccent: true }),
    icon('location-star', 'Saved Place', ['favourite location', 'starred place', 'bookmark place', 'saved', 'map'], [body('M9.5 18.5s-6-5.2-6-9.6a6 6 0 0 1 12 0c0 1.1-.4 2.3-1 3.4'), line(C(9.5, 8.9, 2)), ...STAR], { noAccent: true }),
  ],
};
