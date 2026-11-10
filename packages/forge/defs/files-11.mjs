import { icon, body, line } from '../src/dsl.mjs';
import { R, C, poly } from '../src/geo.mjs';

const DOWN = [line('M18 11v8'), line(poly([[15.5, 16.5], [18, 19], [20.5, 16.5]], 0.5))];
const UP = [line('M18 19v-8'), line(poly([[15.5, 13.5], [18, 11], [20.5, 13.5]], 0.5))];
const CAL = [body(R(3, 5, 12, 13, 2.5)), line('M3.2 9h11.6M6.5 3.5v3M11.5 3.5v3')];
const DB = [body('M3 6.5c0-1.7 2.5-3 5.5-3s5.5 1.3 5.5 3v10c0 1.7-2.5 3-5.5 3S3 18.2 3 16.5Z'), line('M3.2 6.5c0 1.6 2.4 2.8 5.3 2.8s5.3-1.2 5.3-2.8M3.2 11.5c0 1.6 2.4 2.8 5.3 2.8s5.3-1.2 5.3-2.8')];
const NOTE = [line('M9.5 15V5.5l4-1'), body(C(7.5, 15, 2))];
const CODE = [body(R(3, 4, 12, 15, 2)), line('M7.2 9 5.5 11l1.7 2M10.8 9l1.7 2-1.7 2')];

export default {
  category: 'files',
  icons: [
    icon('calendar-download', 'Export Calendar', ['ics', 'download events', 'calendar export', 'add to calendar', 'save'], [...CAL, ...DOWN], { noAccent: true }),
    icon('database-download', 'Export Data', ['data export', 'download database', 'backup', 'dump', 'save'], [...DB, ...DOWN], { noAccent: true, variants: [{ name: 'database-upload', title: 'Import Data', tags: ['data import', 'upload database', 'restore', 'load data', 'migrate'], els: [...DB, ...UP] }] }),
    icon('music-upload', 'Music Upload', ['upload song', 'publish track', 'release music', 'audio', 'share'], [...NOTE, ...UP], { noAccent: true }),
    icon('code-upload', 'Code Upload', ['push code', 'deploy', 'publish source', 'commit', 'developer'], [...CODE, ...UP], { noAccent: true }),
  ],
};
