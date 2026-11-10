import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D } from '../src/geo.mjs';

export default {
  category: 'business',
  icons: [
    icon('priority-matrix', 'Priority Matrix', ['eisenhower', 'quadrants', 'prioritise', 'urgent important', 'swot'], [body(R(3.5, 3.5, 17, 17, 2.5)), line('M12 3.7v16.6M3.7 12h16.6'), accent(D(16.25, 7.75))]),
    icon('job-search', 'Job Search', ['find job', 'recruiting', 'careers', 'hiring', 'vacancy'], [body(R(3, 7, 13, 10.5, 2)), line('M7 7V5.5A1.5 1.5 0 0 1 8.5 4h2A1.5 1.5 0 0 1 12 5.5V7'), line('M3.2 11.5h12.6'), body(C(16, 15.5, 3.3), { cover: true }), line('M18.4 17.9 20.5 20')], { noAccent: true }),
  ],
};
