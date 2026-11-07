import { R, C, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'finance',
  icons: [
    icon('loan', 'Loan', ['lend', 'borrow', 'credit', 'finance', 'give money'], [body(R(3, 14, 3, 6.5, 1)), line('M6 15h3.5l3 1.5h3a1.4 1.4 0 0 1 0 2.8H10M6 19.5h8.5l5.3-3.1a1.5 1.5 0 0 0-1.5-2.6L15.5 15'), accent(C(14, 7.5, 3.5))]),
    icon('credit-score', 'Credit Score', ['rating', 'gauge', 'credit rating', 'score', 'meter'], [line('M4 16A8 8 0 0 1 6.86 9.87'), line('M8 9.07A8 8 0 0 1 14.07 8.27'), accent('M16.59 9.45A8 8 0 0 1 20 16'), line('M12 16 15.54 12.46'), body(C(12, 16, 1.2)), line(L(7, 19.5, 17, 19.5))]),
  ],
};
