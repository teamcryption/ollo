import { icon, body, line } from '../src/dsl.mjs';
import { R, C, poly, gear } from '../src/geo.mjs';

// Small gear in front, bottom right: "X settings".
const GEAR = [body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))];
const t = ['settings', 'preferences', 'configure', 'options'];
const PERSON = [body(C(9, 7.5, 3.3)), body('M3 18.5c.4-2.6 2.9-4.3 6-4.3 1.4 0 2.6.3 3.6.9-1 1-1.6 2.4-1.6 3.9v.5H3.8c-.5 0-.9-.5-.8-1Z')];

export default {
  category: 'interface',
  icons: [
    icon('user-gear', 'Account Settings', ['profile settings', 'manage account', 'user preferences', ...t], [...PERSON, ...GEAR], { noAccent: true }),
    icon('folder-gear', 'Folder Settings', ['folder options', 'sync settings', 'directory config', ...t], [body('M3 7A2 2 0 0 1 5 5h3.2l1.8 1.8h4A2 2 0 0 1 16 8.8V16H5a2 2 0 0 1-2-2Z'), ...GEAR], { noAccent: true }),
    icon('calendar-gear', 'Calendar Settings', ['calendar options', 'working hours', 'availability', ...t], [body(R(3, 5, 13.5, 12.5, 2.5)), line('M3.2 9h13.1M6.5 3.5v3M13 3.5v3'), ...GEAR], { noAccent: true }),
    icon('mail-gear', 'Email Settings', ['mail rules', 'inbox settings', 'smtp', ...t], [body(R(3, 5, 14.5, 11, 2)), line('M5.5 8l4.75 3 4.75-3'), ...GEAR], { noAccent: true }),
    icon('browser-gear', 'Site Settings', ['browser settings', 'web preferences', 'site permissions', ...t], [body(R(3, 4, 15, 12, 2)), line('M3.2 7.5h14.6'), ...GEAR], { noAccent: true }),
    icon('server-gear', 'Server Config', ['server settings', 'devops', 'infrastructure', ...t], [body(R(3, 4, 13, 5.5, 1.5)), body(R(3, 11, 13, 5.5, 1.5)), line('M6 6.75h.01M6 13.75h.01'), ...GEAR], { noAccent: true }),
    icon('card-gear', 'Card Settings', ['card controls', 'payment settings', 'spending limits', ...t], [body(R(3, 5, 15, 10, 2)), line('M3.2 8.5h14.6'), ...GEAR], { noAccent: true }),
    icon('smartphone-gear', 'Device Settings', ['phone settings', 'mobile config', 'device management', ...t], [body(R(4, 3, 9.5, 17, 2.5)), line('M7.5 5.5h2.5'), ...GEAR], { noAccent: true }),
    icon('home-gear', 'Smart Home Settings', ['home automation', 'device setup', 'home config', ...t], [body(poly([[3, 10.5], [9.5, 4.5], [16, 10.5], [16, 18.5], [3, 18.5]], 1, true)), ...GEAR], { noAccent: true }),
    icon('video-gear', 'Video Settings', ['playback settings', 'quality', 'resolution', ...t], [body(R(3, 4, 14, 11.5, 2)), line(poly([[8, 7.2], [11.5, 9.7], [8, 12.2]], 0.5, true)), ...GEAR], { noAccent: true }),
    icon('database-gear', 'Database Settings', ['db config', 'schema settings', 'data management', ...t], [body('M3 6.5c0-1.7 2.5-3 5.5-3s5.5 1.3 5.5 3v10c0 1.7-2.5 3-5.5 3S3 18.2 3 16.5Z'), line('M3.2 6.5c0 1.6 2.4 2.8 5.3 2.8s5.3-1.2 5.3-2.8'), ...GEAR], { noAccent: true }),
    icon('cloud-gear', 'Cloud Settings', ['cloud config', 'storage settings', 'sync preferences', ...t], [body('M6.5 15a3.5 3.5 0 0 1-.4-7 5 5 0 0 1 9.6 1.1A3 3 0 0 1 15.5 15Z'), ...GEAR], { noAccent: true }),
    icon('laptop-gear', 'System Settings', ['computer settings', 'control panel', 'system preferences', ...t], [body(R(5, 5, 12, 8.5, 1.5)), line('M3 16h10'), ...GEAR], { noAccent: true }),
  ],
};
