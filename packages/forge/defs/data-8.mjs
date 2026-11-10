import { icon, body, line } from '../src/dsl.mjs';
import { R, C, A } from '../src/geo.mjs';

export default {
  category: 'data',
  icons: [
    icon('network-graph', 'Network Graph', ['nodes', 'connections', 'graph', 'relationships', 'knowledge graph'], [body(C(12, 12, 1.8)), body(C(5.5, 6.5, 2)), body(C(18, 5.5, 2)), body(C(18.5, 17, 2)), body(C(6.5, 18.5, 2)), line('M7.2 8 10.6 10.8M16.8 7.2l-3.6 3.4M16.8 15.8l-3.4-2.7M8 16.9l2.7-3.5M7.5 6.3h8.5')], { noAccent: true }),
  ],
};
