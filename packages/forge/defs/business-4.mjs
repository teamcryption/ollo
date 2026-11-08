import { R, rotateD } from '../src/geo.mjs';
import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'business',
  icons: [
    icon('stapler', 'Stapler', ['staple', 'office', 'stationery', 'paper', 'desk'], [body('M3.5 13v-1.5L16.5 7.5a3 3 0 0 1 4 2.8V13Z'), body(R(3.5, 15.5, 17, 3.5, 1.2))], { noAccent: true }),
    icon('sticky-note', 'Sticky Note', ['post-it', 'memo', 'reminder', 'note', 'office'], [body('M4 4h16v10.5L14.5 20H4Z'), line('M20 14.5h-4a1.5 1.5 0 0 0-1.5 1.5v4'), line('M7.5 8.5h9M7.5 12h6')], { noAccent: true }),
    icon('binder', 'Binder', ['ring binder', 'folder', 'documents', 'office', 'archive'], [body(R(5, 3.5, 14, 17, 2)), line('M3.5 7.5H7M3.5 12H7M3.5 16.5H7'), line(R(10, 7, 6, 4, 0.8))], { noAccent: true }),
    icon('desk-lamp', 'Desk Lamp', ['lamp', 'light', 'study', 'office', 'reading'], [line('M8 18.5 5.5 12.5l6.2-4.2'), body(rotateD('M14.5 3.5h3l2.5 6h-8Z', 40, 16, 6.5)), body(R(3.5, 18.5, 9, 2, 1))], { noAccent: true }),
  ],
};
