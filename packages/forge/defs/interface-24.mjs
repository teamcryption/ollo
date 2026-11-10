import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'interface',
  icons: [
    icon('radio-button', 'Radio Buttons', ['radio', 'option', 'choice', 'form', 'select one'], [line(C(6.5, 8, 3)), body(C(6.5, 8, 1.3)), line('M12 8h8'), line(C(6.5, 16, 3)), line('M12 16h6')], { noAccent: true }),
    icon('skeleton-loader', 'Skeleton Loader', ['placeholder', 'loading state', 'shimmer', 'ui', 'content loading'], [body(R(3.5, 4.5, 17, 15, 2.5)), line(C(8, 9.5, 2)), line('M12 8.5h5M12 11h3'), accent('M7 15.5h10')]),
    icon('command-palette', 'Command Palette', ['command menu', 'quick actions', 'launcher', 'search commands', 'shortcuts'], [body(R(3.5, 4, 17, 16, 2.5)), line('M3.7 9h16.6'), line('M6.5 5.5l1.5 1-1.5 1M10 6.5h6'), line('M7 12.5h10'), accent('M7 16h7')]),
    icon('progress-ring', 'Progress Ring', ['progress', 'circular progress', 'completion', 'percent', 'loading'], [line(A(12, 12, 8, -90, 180)), accent(L(9.5, 12, 14.5, 12))]),
    icon('split-button', 'Split Button', ['dropdown button', 'menu button', 'ui', 'action menu', 'options'], [body(R(3, 8, 18, 8, 2.5)), line('M15 8.2v7.6'), line('M16.8 11.2l1.2 1.3 1.2-1.3'), accent('M6.5 12h5')]),
  ],
};
