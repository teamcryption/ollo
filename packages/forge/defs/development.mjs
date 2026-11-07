import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const WIN = R(3, 4, 18, 16, 2.5);

export default {
  category: 'development',
  icons: [
    icon('code', 'Code', ['html', 'brackets', 'developer', 'programming'], [line(poly([[8, 7], [3.5, 12], [8, 17]], 0.8)), line(poly([[16, 7], [20.5, 12], [16, 17]], 0.8)), accent(L(13.5, 5.5, 10.5, 18.5))], { anim: 'pop-draw' }),
    icon('terminal', 'Terminal', ['console', 'command line', 'shell', 'cli', 'bash'], [body(WIN), line(poly([[7, 9.5], [10, 12], [7, 14.5]], 0.6)), accent(L(12, 15, 17, 15))], { anim: 'pop-draw' }),
    icon('code-window', 'Code Window', ['ide', 'editor', 'source', 'developer'], [body(WIN), line(L(3.2, 8.5, 20.8, 8.5)), line(poly([[9.5, 11.5], [7.5, 14], [9.5, 16.5]], 0.5)), accent(poly([[14.5, 11.5], [16.5, 14], [14.5, 16.5]], 0.5))]),
    icon('git-branch', 'Branch', ['git', 'version control', 'fork', 'branch'], [body(C(6.5, 5.5, 2.2)), body(C(6.5, 18.5, 2.2)), body(C(17.5, 7.5, 2.2)), line(L(6.5, 7.7, 6.5, 16.3)), line('M17.5 9.7v.8a4 4 0 0 1-4 4H11a4 4 0 0 0-4 3')], { noAccent: true }),
    icon('git-merge', 'Merge', ['git', 'pull request', 'combine', 'merge'], [body(C(6.5, 5.5, 2.2)), body(C(6.5, 18.5, 2.2)), body(C(17.5, 15, 2.2)), line(L(6.5, 7.7, 6.5, 16.3)), line('M6.5 7.7a7.3 7.3 0 0 0 8.8 7.3')], { noAccent: true }),
    icon('git-pull-request', 'Pull Request', ['git', 'pr', 'review', 'code review'], [body(C(6.5, 5.5, 2.2)), body(C(6.5, 18.5, 2.2)), body(C(17.5, 18.5, 2.2)), line(L(6.5, 7.7, 6.5, 16.3)), line('M17.5 16.3V9.5a3 3 0 0 0-3-3h-3'), line(poly([[13, 4.5], [11, 6.5], [13, 8.5]], 0.5))], { noAccent: true }),
    icon('bug', 'Bug', ['debug', 'error', 'issue', 'insect', 'defect'], [line('M9.5 8.5a2.5 2.5 0 0 1 5 0'), body(R(7.5, 8.5, 9, 12, 4.5)), line(L(4, 14, 7.2, 14)), line(L(16.8, 14, 20, 14)), line(L(4.8, 9, 7.6, 10.6)), line(L(19.2, 9, 16.4, 10.6)), line(L(4.8, 19.5, 7.6, 17.8)), line(L(19.2, 19.5, 16.4, 17.8)), accent(L(12, 12, 12, 17))], { anim: 'wiggle' }),
    icon('api', 'API', ['endpoint', 'integration', 'webhook', 'connect'], [body(C(12, 12, 3.2)), line(L(12, 3.5, 12, 6.5)), line(L(12, 17.5, 12, 20.5)), line(L(3.5, 12, 6.5, 12)), line(L(17.5, 12, 20.5, 12)), accent(D(12, 12))], { anim: 'spin' }),
    icon('puzzle', 'Plugin', ['extension', 'add-on', 'integration', 'puzzle', 'module'], [body('M5 7.5A1.5 1.5 0 0 1 6.5 6H9a2 2 0 1 1 4 0h2.5A1.5 1.5 0 0 1 17 7.5V10a2 2 0 1 1 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5H13a2 2 0 1 0-4 0H6.5A1.5 1.5 0 0 1 5 16.5Z'), accent(D(11, 12))]),
    icon('webhook', 'Webhook', ['hook', 'event', 'trigger', 'integration'], [body(C(12, 6.5, 2.2)), body(C(6, 17, 2.2)), body(C(18, 17, 2.2)), line('M10.8 8.4 7.3 14.9'), line('M13.2 8.4l3.5 6.5'), line(L(8.4, 17, 15.6, 17))], { noAccent: true }),
    icon('package-code', 'Package', ['npm', 'module', 'library', 'dependency'], [body('M12 3.5l7.5 4.2v8.6L12 20.5l-7.5-4.2V7.7Z'), line('M4.8 7.9 12 12l7.2-4.1'), line(L(12, 12, 12, 20.2))], { noAccent: true }),
    icon('cloud-code', 'Cloud Code', ['serverless', 'deploy', 'hosting', 'devops'], [body('M7 18.5a4 4 0 0 1-.6-8 5.8 5.8 0 0 1 11.2 1.1A3.5 3.5 0 0 1 17 18.5Z'), line(poly([[10.4, 12.6], [9, 14.2], [10.4, 15.8]], 0.4)), accent(poly([[13.6, 12.6], [15, 14.2], [13.6, 15.8]], 0.4))]),
    icon('braces', 'Braces', ['json', 'object', 'code', 'curly brackets'], [line('M8.5 4H8a2 2 0 0 0-2 2v3.5a2 2 0 0 1-2 2v1a2 2 0 0 1 2 2V18a2 2 0 0 0 2 2h.5'), line('M15.5 4h.5a2 2 0 0 1 2 2v3.5a2 2 0 0 0 2 2v1a2 2 0 0 0-2 2V18a2 2 0 0 1-2 2h-.5'), accent(D(12, 12))]),
  ],
};
