import { D, poly } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const picket = (x) => poly([[x, 7], [x + 1.6, 4], [x + 3.2, 7], [x + 3.2, 20.5], [x, 20.5]], 0.6, true);

export default {
  category: 'home',
  icons: [
    icon('sink', 'Sink', ['basin', 'tap', 'bathroom', 'wash', 'faucet'], [line('M9.5 11V6.5a2.5 2.5 0 0 1 5 0'), body('M3.5 11h17v1.5a6.5 6.5 0 0 1-6.5 6.5h-4a6.5 6.5 0 0 1-6.5-6.5Z'), accent(D(14.5, 8.7))]),
    icon('fence', 'Fence', ['picket', 'garden', 'yard', 'boundary', 'property'], [line('M6.7 9.5h3.7M13.6 9.5h3.7M6.7 15.5h3.7M13.6 15.5h3.7'), body(picket(3.5)), body(picket(10.4)), body(picket(17.3))], { noAccent: true }),
  ],
};
