import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const BADGES4 = ['add', 'remove', 'check', 'close'];

export default {
  category: 'people',
  icons: [
    // The Figma user is the base; only its variants are drawn here.
    icon('user', 'User', ['person', 'profile', 'account', 'member'], [body('M12 4.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z'), body('M5.5 19c.4-2.7 3.1-4.5 6.5-4.5s6.1 1.8 6.5 4.5c.1.6-.4 1-.9 1H6.4c-.5 0-1-.4-.9-1Z')], { extend: true, badges: ['add', 'remove', 'check', 'close', 'alert'] }),
    icon('profile-circle', 'Profile Circle', ['user', 'account', 'avatar', 'person', 'me'], [body(C(12, 12, 8.5)), line(C(12, 9.8, 2.6)), accent('M8.3 16.8a4.6 4.6 0 0 1 7.4 0')], { badges: BADGES4 }),
    icon('users', 'Users', ['people', 'team', 'members', 'group', 'friends'], [line(C(16.2, 7.6, 2.4)), accent('M17.6 12.8a4.6 4.6 0 0 1 3.4 4.4'), body(C(9.2, 8.6, 3)), body('M3.4 19.5a5.8 5.8 0 0 1 11.6 0Z')], { badges: ['add', 'check'] }),
    icon('user-group', 'User Group', ['team', 'community', 'crowd', 'people', 'department'], [line(C(5.6, 9.6, 1.8)), line('M2.6 17.2a3.4 3.4 0 0 1 2.8-3.3'), line(C(18.4, 9.6, 1.8)), accent('M21.4 17.2a3.4 3.4 0 0 0-2.8-3.3'), body(C(12, 7.8, 2.6)), body('M6.8 18.6a5.2 5.2 0 0 1 10.4 0Z')]),
    icon('id-badge', 'ID Badge', ['identity', 'employee', 'pass', 'badge', 'card'], [body(R(5, 3.5, 14, 17, 2.5)), line(L(10.5, 6.5, 13.5, 6.5)), line(C(12, 10.2, 1.8)), accent('M8.8 17.5a3.2 3.2 0 0 1 6.4 0')]),
    icon('user-square', 'User Square', ['avatar', 'profile', 'account', 'person'], [body(R(3.5, 3.5, 17, 17, 4)), line(C(12, 9.8, 2.7)), line('M7.2 18.4a5.3 5.3 0 0 1 9.6 0')], { noAccent: true, badges: ['add', 'check'] }),
    icon('contact-book', 'Contact Book', ['address book', 'contacts', 'phonebook', 'directory'], [body(R(4.5, 3.5, 13.5, 17, 2.5)), line(C(11.2, 10.2, 2)), line('M7.8 16.2a3.5 3.5 0 0 1 6.8 0'), accent(L(20, 6.5, 20, 8.5)), line(L(20, 11, 20, 13)), line(L(20, 15.5, 20, 17.5))]),
    icon('crown', 'Crown', ['premium', 'king', 'vip', 'pro', 'leader'], [body(poly([[4, 8], [8.5, 12], [12, 5.5], [15.5, 12], [20, 8], [18.6, 18], [5.4, 18]], 1.2, true)), accent(L(8.5, 15, 15.5, 15))], { anim: 'pulse' }),
  ],
};
