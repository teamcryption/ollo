import { icon, body, line } from '../src/dsl.mjs';
import { R, C, poly, star } from '../src/geo.mjs';

const LENS = [body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')];
const CLOCK = [body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')];
const STAR = [body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })];
const PIN = [body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))];
const DOWN = [line('M18 11v8'), line(poly([[15.5, 16.5], [18, 19], [20.5, 16.5]], 0.5))];
const TICKET = [body('M3 7.5A1.5 1.5 0 0 1 4.5 6h10A1.5 1.5 0 0 1 16 7.5V9a1.5 1.5 0 0 0 0 3v1.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 13.5V12a1.5 1.5 0 0 0 0-3Z'), line('M11 6.5v1.5M11 10v1M11 13v1.5')];
const MSG = [body('M5.5 4h9A2.5 2.5 0 0 1 17 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3A2.5 2.5 0 0 1 3 10.5v-4A2.5 2.5 0 0 1 5.5 4Z')];
const BROWSER = [body(R(3, 4, 15, 12, 2)), line('M3.2 7.5h14.6')];

export default {
  category: 'interface',
  icons: [
    icon('ticket-star', 'VIP Ticket', ['vip pass', 'premium ticket', 'front row', 'event', 'exclusive'], [...TICKET, ...STAR], { noAccent: true }),
    icon('ticket-search', 'Find Events', ['search tickets', 'event finder', 'what is on', 'concerts', 'shows'], [...TICKET, ...LENS], { noAccent: true }),
    icon('ticket-download', 'E-ticket', ['mobile ticket', 'download ticket', 'digital pass', 'boarding', 'event'], [...TICKET, ...DOWN], { noAccent: true }),
    icon('message-pin', 'Share Location', ['send location', 'location message', 'meet here', 'chat', 'map'], [...MSG, ...PIN], { noAccent: true }),
    icon('folder-clock', 'Recent Folder', ['recent files', 'history', 'last opened', 'archive', 'folder'], [body('M3 7A2 2 0 0 1 5 5h3.2l1.8 1.8h4A2 2 0 0 1 16 8.8V16H5a2 2 0 0 1-2-2Z'), ...CLOCK], { noAccent: true }),
    icon('mail-search', 'Search Email', ['find email', 'inbox search', 'mail lookup', 'search messages', 'email'], [body(R(3, 5, 14.5, 11, 2)), line('M5.5 8l4.75 3 4.75-3'), ...LENS], { noAccent: true }),
    icon('smartphone-pin', 'Find My Phone', ['locate device', 'lost phone', 'device location', 'tracking', 'phone'], [body(R(4, 3, 9.5, 17, 2.5)), line('M7.5 5.5h2.5'), ...PIN], { noAccent: true }),
    icon('id-clock', 'ID Expiry', ['expiring document', 'renewal', 'valid until', 'licence', 'passport'], [body(R(3, 5, 15, 11, 2)), line(C(7.5, 9.5, 1.5)), line('M5.3 13.5a2.4 2.4 0 0 1 4.4 0M11.5 9h3.5'), ...CLOCK], { noAccent: true }),
    icon('server-clock', 'Uptime', ['server uptime', 'availability', 'sla', 'monitoring', 'hosting'], [body(R(3, 4, 13, 5.5, 1.5)), body(R(3, 11, 13, 5.5, 1.5)), line('M6 6.75h.01M6 13.75h.01'), ...CLOCK], { noAccent: true }),
    icon('browser-clock', 'Browsing History', ['history', 'recently visited', 'web history', 'past pages', 'browser'], [...BROWSER, ...CLOCK], { noAccent: true }),
    icon('browser-star', 'Bookmarks', ['favourite sites', 'saved pages', 'bookmark', 'reading list', 'browser'], [...BROWSER, ...STAR], { noAccent: true }),
  ],
};
