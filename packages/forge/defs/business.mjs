import { R, C, L, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const PAGE = R(4.5, 3, 15, 18, 2.5);

export default {
  category: 'business',
  icons: [
    icon('briefcase', 'Briefcase', ['work', 'job', 'business', 'portfolio', 'career'], [body(R(3.5, 7.5, 17, 12, 2.5)), line('M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5'), line(L(3.7, 12.5, 20.3, 12.5)), accent(L(10.5, 15.8, 13.5, 15.8))], { badges: ['add', 'check', 'close'] }),
    icon('signature', 'Signature', ['sign', 'autograph', 'approve', 'contract'], [line('M3.5 16c2-4 3.5-8 5-8s-1 8 1 8 3-4 4.5-4-.5 4 1 4 2-1.5 3-1.5'), accent(L(3.5, 20, 20.5, 20))], { anim: 'pop-draw' }),
    icon('stamp', 'Stamp', ['approve', 'seal', 'official', 'certify'], [body(C(12, 6, 2.5)), line(L(12, 8.5, 12, 13)), body(R(5, 13, 14, 4, 1.2)), accent(L(6, 20, 18, 20))], { anim: { preset: 'bounce', dist: 1.5 } }),
    icon('contract', 'Contract', ['agreement', 'document', 'legal', 'sign', 'deal'], [body(PAGE), line(L(8, 7.5, 16, 7.5)), line(L(8, 11, 13, 11)), accent('M8 16.5c1-1.5 2-2.5 2.5-1.5s.5 2 1.5 1 1.5-1.5 2.5-.5')], { badges: ['check', 'close'] }),
    icon('report', 'Report', ['analytics', 'document', 'summary', 'chart', 'review'], [body(PAGE), line(L(8, 7, 12.5, 7)), line(L(9, 17, 9, 14)), line(L(12, 17, 12, 11)), accent(L(15, 17, 15, 13))]),
    icon('scale', 'Balance', ['legal', 'law', 'justice', 'compare', 'fair'], [line(L(5, 7, 19, 7)), line(L(12, 7, 12, 19.5)), line(L(8.5, 19.5, 15.5, 19.5)), line('M3.5 13.5 5.5 7.5l2 6'), body('M3.5 13.5a2 2 0 0 0 4 0Z'), line('M16.5 13.5l2-6 2 6'), body('M16.5 13.5a2 2 0 0 0 4 0Z'), accent(D(12, 4))], { anim: 'wiggle' }),
    icon('certificate', 'Certificate', ['award', 'diploma', 'achievement', 'credential'], [body(R(3.5, 4.5, 17, 12, 2)), line(L(7, 8.5, 13, 8.5)), accent(L(7, 11.5, 10.5, 11.5)), line('M14.5 16.2V20l1.5-1 1.5 1v-3.8'), body(C(16, 14, 2.6), { cover: true })]),
    icon('workflow', 'Workflow', ['process', 'flow', 'automation', 'pipeline', 'steps'], [body(R(3.5, 3.5, 6, 6, 1.5)), body(R(14.5, 14.5, 6, 6, 1.5)), line('M9.5 6.5h3a2 2 0 0 1 2 2v6')], { noAccent: true }),
    icon('kanban', 'Kanban', ['board', 'tasks', 'columns', 'project', 'agile'], [body(R(3.5, 3.5, 17, 17, 3)), line(L(8, 7.5, 8, 14)), line(L(12, 7.5, 12, 16.5)), accent(L(16, 7.5, 16, 11.5))], { badges: ['add'] }),
    icon('podium', 'Podium', ['speech', 'lectern', 'keynote', 'presentation', 'conference'], [body(poly([[6, 10], [18, 10], [16.5, 20.5], [7.5, 20.5]], 0.8, true)), line(L(12, 6, 12, 10)), body(C(12, 4.5, 1.5)), accent(L(10, 14.5, 14, 14.5))]),
    icon('rocket', 'Rocket', ['launch', 'startup', 'boost', 'growth', 'ship'], [body('M12 3c3 2 4.5 5.2 4.5 9v4h-9v-4C7.5 8.2 9 5 12 3Z'), line('M7.5 12.5 5 15v3h2.5'), line('M16.5 12.5 19 15v3h-2.5'), line(C(12, 9, 1.5)), accent(L(12, 18.5, 12, 20.5))], { anim: { preset: 'bounce', dist: -2 } }),
  ],
};
