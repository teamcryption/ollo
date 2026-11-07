import { icon, line, accent } from '../src/dsl.mjs';

export default {
  category: 'weather',
  icons: [
    icon('tide', 'Tide', ['high tide', 'low tide', 'sea level', 'ocean', 'water level'], [accent('M12 4v8M9.5 6.5 12 4l2.5 2.5M9.5 9.5 12 12l2.5-2.5'), line('M3.5 16c1.4-1 2.8-1 4.2 0s2.8 1 4.2 0 2.8-1 4.2 0 2.8 1 4.2 0'), line('M3.5 19.5c1.4-1 2.8-1 4.2 0s2.8 1 4.2 0 2.8-1 4.2 0 2.8 1 4.2 0')]),
  ],
};
