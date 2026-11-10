import { icon, body, line } from '../src/dsl.mjs';
import { R } from '../src/geo.mjs';

const SH = body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true });
const t = ['protected', 'secure', 'safe', 'security'];

export default {
  category: 'security',
  icons: [
    icon('browser-shield', 'Web Security', ['secure browsing', 'safe web', 'https', ...t], [body(R(3, 4, 15, 12, 2)), line('M3.2 7.5h14.6'), SH], { noAccent: true }),
    icon('mail-shield', 'Email Security', ['spam filter', 'secure email', 'anti phishing', ...t], [body(R(3, 5, 14.5, 11, 2)), line('M5.5 8l4.75 3 4.75-3'), SH], { noAccent: true }),
    icon('database-shield', 'Data Protection', ['secure database', 'backup', 'gdpr', ...t], [body('M3.5 6.5c0-1.7 2.7-3 6-3s6 1.3 6 3v9c0 1.7-2.7 3-6 3s-6-1.3-6-3Z'), line('M3.7 6.5c0 1.6 2.6 2.8 5.8 2.8s5.8-1.2 5.8-2.8'), SH], { noAccent: true }),
    icon('folder-shield', 'Secure Folder', ['private folder', 'vault', 'protected files', ...t], [body('M3 7A2 2 0 0 1 5 5h3.2l1.8 1.8h4A2 2 0 0 1 16 8.8V16H5a2 2 0 0 1-2-2Z'), SH], { noAccent: true }),
  ],
};
