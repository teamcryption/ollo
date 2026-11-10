import { icon, body, line } from '../src/dsl.mjs';
import { R, C } from '../src/geo.mjs';

export default {
  category: 'security',
  icons: [
    icon('secure-chat', 'Secure Chat', ['encrypted message', 'private chat', 'end to end', 'locked conversation', 'secret'], [body('M5.5 4h10A2.5 2.5 0 0 1 18 6.5v6a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3A2.5 2.5 0 0 1 3 12.5v-6A2.5 2.5 0 0 1 5.5 4Z'), line('M14.5 14v-1.5a2 2 0 0 1 4 0V14'), body(R(13, 14, 7, 6, 1.5), { cover: true })], { noAccent: true }),
    icon('antivirus', 'Antivirus', ['malware protection', 'virus shield', 'endpoint security', 'scan', 'protection'], [body('M12 3.5 18.5 6v5.3c0 4.2-2.7 7.7-6.5 9.2-3.8-1.5-6.5-5-6.5-9.2V6Z'), line(C(12, 11.5, 2.2)), line('M12 7.8v1.5M12 13.7v1.5M8.3 11.5h1.5M14.2 11.5h1.5')], { noAccent: true }),
  ],
};
