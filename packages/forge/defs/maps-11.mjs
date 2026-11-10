import { icon, body, line } from '../src/dsl.mjs';
import { R, C } from '../src/geo.mjs';

export default {
  category: 'maps',
  icons: [
    icon('pier', 'Pier', ['jetty', 'dock', 'boardwalk', 'harbour', 'waterfront'], [body(R(3, 9.5, 18, 2.5, 1)), line('M6 12v5.5M12 12v5.5M18 12v5.5'), line('M3.5 19.5c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 2.2.7 3 .3')], { noAccent: true }),
  ],
};
