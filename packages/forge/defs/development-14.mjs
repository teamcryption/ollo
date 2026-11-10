import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, head, gear, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'development',
  icons: [
    icon('branch-lock', 'Protected Branch', ['branch protection', 'locked branch', 'git', 'code', 'branch'], [line(C(5, 5, 1.8) + C(5, 15, 1.8) + C(13, 7, 1.8)), line('M5 6.8v6.4M13 8.8c0 3-3 3.2-6.5 4.8'), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('branch-search', 'Find Branch', ['branch search', 'git lookup', 'repository', 'code', 'branch'], [line(C(5, 5, 1.8) + C(5, 15, 1.8) + C(13, 7, 1.8)), line('M5 6.8v6.4M13 8.8c0 3-3 3.2-6.5 4.8'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('terminal-lock', 'Secure Shell', ['ssh', 'root access', 'locked terminal', 'command line', 'terminal'], [body(R(3, 4, 13, 11, 1.5)), line('M5.5 8l2 1.5-2 1.5M9.5 12h3'), line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })], { noAccent: true }),
    icon('terminal-gear', 'Shell Config', ['terminal settings', 'dotfiles', 'configure', 'command line', 'terminal'], [body(R(3, 4, 13, 11, 1.5)), line('M5.5 8l2 1.5-2 1.5M9.5 12h3'), body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))], { noAccent: true }),
    icon('terminal-bolt', 'Quick Command', ['run command', 'instant script', 'shortcut', 'command line', 'terminal'], [body(R(3, 4, 13, 11, 1.5)), line('M5.5 8l2 1.5-2 1.5M9.5 12h3'), body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })], { noAccent: true }),
    icon('bug-search', 'Debugging', ['find bug', 'inspect', 'troubleshoot', 'bug', 'bug'], [body(E(9.5, 11, 3.5, 4.5)), line('M6 8 4 6.5M13 8l2-1.5M6 11H3.5M13 11h2.5M6.5 14l-2 1.5M12.5 14l2 1.5M9.5 6.5V15.5'), body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')], { noAccent: true }),
    icon('bug-shield', 'Bug Bounty', ['security bug', 'vulnerability', 'protection', 'bug', 'bug'], [body(E(9.5, 11, 3.5, 4.5)), line('M6 8 4 6.5M13 8l2-1.5M6 11H3.5M13 11h2.5M6.5 14l-2 1.5M12.5 14l2 1.5M9.5 6.5V15.5'), body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })], { noAccent: true }),
  ],
};
