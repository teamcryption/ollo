import { C } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'devices',
  icons: [
    icon('robot-vacuum', 'Robot Vacuum', ['vacuum', 'cleaning robot', 'smart home', 'roomba', 'floor'], [body(C(12, 12, 8.5)), line('M5 8h14'), accent(C(12, 14, 1.8))]),
  ],
};
