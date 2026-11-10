import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, star } from '../src/geo.mjs';

const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'ai',
  icons: [
    icon('ai-wallet', 'AI Finance', ['smart wallet', 'ai budgeting', 'money assistant', 'spending insights', 'fintech'], [body(R(3, 7, 13.5, 12.5, 2.5)), line('M16.3 11h-3.8a2 2 0 0 0 0 4h3.8'), spark(19.5, 4.8, 2)], { anim: 'pulse' }),
    icon('ai-clipboard', 'AI Tasks', ['smart checklist', 'task assistant', 'auto plan', 'to do ai', 'clipboard'], [body(R(3.5, 5, 12, 15.5, 2.5)), body(R(6.5, 3.5, 6, 3, 1), { cover: true }), line('M6.5 11h6M6.5 14h6M6.5 17h3.5'), spark(19.5, 5, 2)], { anim: 'pulse' }),
    icon('ai-flask', 'AI Research', ['ai science', 'experiment', 'lab ai', 'discovery', 'r and d'], [body('M8 4h4v5l4.2 8.6a2 2 0 0 1-1.8 2.9H5.6a2 2 0 0 1-1.8-2.9L8 9Z'), line('M6 15h8'), spark(19, 5.5, 2.2)], { anim: 'pulse' }),
    icon('ai-palette', 'AI Design', ['generative design', 'ai art', 'creative ai', 'colour ai', 'palette'], [body('M9.5 5c4.1 0 7 2.6 7 6.1 0 2.2-1.7 3.1-3.2 3.1h-1.4c-1 0-1.7 1-1.2 1.9.5 1.1-.1 2.4-1.5 2.4C5.4 18.5 3 15.2 3 11.7S5.4 5 9.5 5Z'), line(D(6.5, 11) + D(8.5, 8) + D(12, 8)), spark(19.5, 5, 2)], { anim: 'pulse' }),
    icon('ai-bug', 'AI Debug', ['ai fix', 'auto debug', 'bug finder', 'code assistant', 'troubleshoot'], [line('M7.5 8.5a2.5 2.5 0 0 1 5 0'), body(E(10, 14, 4.5, 5.5)), line('M5.5 12H3.5M5.5 15.5H3.5M14.5 12h2M14.5 15.5h2'), spark(19.5, 5, 2)], { anim: 'pulse' }),
    icon('ai-terminal', 'AI Terminal', ['ai command line', 'shell assistant', 'cli ai', 'console', 'agent terminal'], [body(R(3, 6, 13.5, 13, 2.5)), line('M6.5 10.5l2.5 2-2.5 2M11 15h3'), spark(19.5, 5, 2)], { anim: 'pulse' }),
    icon('ai-briefcase', 'AI Recruiting', ['ai hiring', 'talent ai', 'work assistant', 'business ai', 'jobs'], [line('M7 8V6.5A1.5 1.5 0 0 1 8.5 5H11a1.5 1.5 0 0 1 1.5 1.5V8'), body(R(3, 8, 13.5, 11.5, 2.5)), line('M3.2 12.5h13.1'), spark(19.5, 5, 2)], { anim: 'pulse' }),
    icon('ai-bell', 'AI Alerts', ['smart alerts', 'ai notifications', 'priority inbox', 'reminders', 'signals'], [body('M9.5 4a5 5 0 0 1 5 5v4l1.5 2.5H3L4.5 13V9a5 5 0 0 1 5-5Z'), line('M8 18.5h3'), spark(19, 5, 2.2)], { anim: 'pulse' }),
    icon('ai-inbox', 'AI Inbox', ['smart inbox', 'triage', 'email ai', 'sorting', 'priority mail'], [body(R(3, 6, 13.5, 13.5, 2.5)), line('M3.2 13h3.6l1.5 2.5h3l1.5-2.5h3.5'), spark(19.5, 5, 2)], { anim: 'pulse' }),
    icon('ai-receipt', 'AI Expenses', ['expense scan', 'receipt ai', 'auto bookkeeping', 'spend', 'accounting'], [body('M4 5a1.5 1.5 0 0 1 1.5-1.5h8A1.5 1.5 0 0 1 15 5v15.5l-1.8-1.2-1.9 1.2-1.8-1.2-1.8 1.2-1.9-1.2L4 20.5Z'), line('M7 8h5M7 11h5M7 14h3'), spark(19, 6, 2.2)], { anim: 'pulse' }),
    icon('ai-calculator', 'AI Calculator', ['smart maths', 'ai estimate', 'calculate', 'solver', 'numbers'], [body(R(3.5, 4, 12, 16.5, 2.5)), line(R(6, 6.5, 7, 3, 0.8)), line(D(6.5, 13) + D(9.5, 13) + D(12.5, 13) + D(6.5, 16.5) + D(9.5, 16.5) + D(12.5, 16.5)), spark(19.5, 5, 2)], { anim: 'pulse' }),
  ],
};
