import { icon, body, line } from '../src/dsl.mjs';
import { R, D } from '../src/geo.mjs';

const LOCK = [line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })];
const SH = body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true });

export default {
  category: 'security',
  icons: [
    icon('database-lock', 'Encrypted Database', ['encryption at rest', 'locked data', 'secure storage', 'private', 'database'], [body('M3 6.5c0-1.7 2.5-3 5.5-3s5.5 1.3 5.5 3v10c0 1.7-2.5 3-5.5 3S3 18.2 3 16.5Z'), line('M3.2 6.5c0 1.6 2.4 2.8 5.3 2.8s5.3-1.2 5.3-2.8'), ...LOCK], { noAccent: true }),
    icon('browser-lock', 'Secure Connection', ['https', 'ssl', 'secure site', 'padlock', 'encrypted'], [body(R(3, 4, 15, 12, 2)), line('M3.2 7.5h14.6'), ...LOCK], { noAccent: true }),
    icon('image-shield', 'Photo Copyright', ['image protection', 'watermark', 'copyright', 'protected photo', 'rights'], [body(R(3, 4, 14, 11.5, 2)), line('M5.5 12.5l2.8-2.8 2.2 2.2'), line(D(13, 7.5)), SH], { noAccent: true }),
  ],
};
