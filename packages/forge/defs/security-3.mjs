import { R, L } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'security',
  icons: [
    icon('firewall', 'Firewall', ['network security', 'wall', 'protection', 'block', 'filter traffic'], [body(R(3.5, 10.3, 17, 10.2, 1.5)), line('M3.7 13.7h16.6M3.7 17.1h16.6M9 10.5v3.2M15 10.5v3.2M12 13.7v3.4M9 17.1v3.2M15 17.1v3.2'), accent('M12 3c-1.3 1.3-2 2.3-2 3.2a2 2 0 0 0 4 0c0-.9-.7-1.9-2-3.2Z')]),
  ],
};
