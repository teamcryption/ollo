import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'energy',
  icons: [
    icon('jerrycan', 'Jerrycan', ['fuel can', 'petrol can', 'gas can', 'canister', 'reserve fuel'], [line('M7.2 6.2 4.5 3.8'), body('M5.5 9 9.5 4h9A1.5 1.5 0 0 1 20 5.5v13.5a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19Z'), accent('M10 10l6 6M16 10l-6 6')]),
  ],
};
