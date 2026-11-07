import { L, poly } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'energy',
  icons: [
    icon('hydro-power', 'Hydro Power', ['dam', 'hydroelectric', 'water power', 'renewable', 'reservoir'], [body(poly([[4, 5], [8, 5], [11, 20.5], [4, 20.5]], 0.6, true)), line('M12 8c1.5 1 3 1 4.5 0s3-1 4.5 0'), line('M12.8 11.5c1.3.9 2.7.9 4 0s2.7-.9 4 0'), accent(poly([[17.5, 15], [15.5, 18], [18, 18], [16, 20.8]], 0.3))]),
    icon('gas-cylinder', 'Gas Cylinder', ['propane', 'lpg', 'gas tank', 'cooking gas', 'butane'], [line('M10 6.8V4.5h4v2.3'), body('M6.5 20.5V11a5.5 4 0 0 1 11 0v9.5Z'), line(L(6.7, 10.8, 17.3, 10.8)), accent('M12 13c-1.2 1.2-2 2.2-2 3.2a2 2 0 0 0 4 0c0-1-.8-2-2-3.2Z')]),
  ],
};
