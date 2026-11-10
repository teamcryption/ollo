import { icon, body, line } from '../src/dsl.mjs';

export default {
  category: 'celebration',
  icons: [
    icon('circus-tent', 'Circus Tent', ['big top', 'circus', 'carnival', 'show', 'fair'], [line('M12 5V3h2.5'), body('M3.5 20.5V13L12 5l8.5 8v7.5Z'), line('M8 20.5V9.5M16 20.5V9.5')], { noAccent: true }),
  ],
};
