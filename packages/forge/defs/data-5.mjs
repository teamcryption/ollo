import { C, arcArrow } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const CLOUD = 'M7 18.5a4 4 0 0 1-.6-8 5.8 5.8 0 0 1 11.2 1.1A3.5 3.5 0 0 1 17 18.5Z';
const DB = [body('M5 6.5c0-1.7 3.1-3 7-3s7 1.3 7 3v11c0 1.7-3.1 3-7 3s-7-1.3-7-3Z'), line('M5.2 6.8c.7 1.5 3.4 2.7 6.8 2.7s6.1-1.2 6.8-2.7'), line('M5.2 12.2c.7 1.5 3.4 2.6 6.8 2.6s6.1-1.1 6.8-2.6')];
const sync = (cx, cy, r, s) => [...arcArrow(cx, cy, r, 200, 340, s), ...arcArrow(cx, cy, r, 20, 160, s)].join('');

export default {
  category: 'data',
  icons: [
    icon('cloud-sync', 'Cloud Sync', ['sync', 'backup', 'cloud storage', 'refresh', 'upload'], [body(CLOUD), line(sync(12, 14, 2.6, 2))], { noAccent: true }),
    icon('database-backup', 'Database Backup', ['backup', 'restore', 'storage', 'snapshot', 'data'], [...DB, body(C(17, 17, 4), { cover: true, badge: true }), accent(arcArrow(17, 17, 2.1, -60, 230, 1.8).join(''), { badge: true })]),
  ],
};
