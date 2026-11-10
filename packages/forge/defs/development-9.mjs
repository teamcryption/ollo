import { icon, body, line } from '../src/dsl.mjs';
import { R, C } from '../src/geo.mjs';

export default {
  category: 'development',
  icons: [
    icon('load-balancer', 'Load Balancer', ['traffic', 'distribute', 'scaling', 'servers', 'routing'], [body(C(12, 5, 2)), line('M10.9 6.8 6 15.5M12 7v8.5M13.1 6.8 18 15.5'), body(R(3.5, 15.5, 5, 5, 1.2)), body(R(9.5, 15.5, 5, 5, 1.2)), body(R(15.5, 15.5, 5, 5, 1.2))], { noAccent: true }),
    icon('diff', 'Diff', ['code diff', 'changes', 'compare files', 'additions deletions', 'patch'], [body(R(3.5, 3.5, 17, 17, 2.5)), line('M12 3.7v16.6'), line('M6 12h3.5'), line('M14.5 12h3.5M16.25 10.25v3.5')], { noAccent: true }),
  ],
};
