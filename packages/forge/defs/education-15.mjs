import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, E, L, A, D, poly, star, rotateD, translateD, scaleD } from '../src/geo.mjs';

const rot = (els, deg, cx = 12, cy = 12) => els.map((e) => ({ ...e, d: rotateD(e.d, deg, cx, cy) }));
const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'education',
  icons: [
    icon('asterisk', 'Asterisk', ['star symbol', 'required', 'footnote', 'wildcard', 'multiply'], [line('M12 4.5v15M5.5 8.25l13 7.5M18.5 8.25l-13 7.5')], { noAccent: true }),
    icon('pi', 'Pi', ['math', 'constant', 'geometry', 'circle', 'greek'], [line('M4.5 7.5h15M8.5 7.5v12M15.5 7.5V17c0 1.5.8 2.5 2.5 2.5')], { noAccent: true }),
    icon('sigma', 'Sigma', ['sum', 'summation', 'math', 'greek', 'total'], [line('M18 5H6l6 7-6 7h12')], { noAccent: true }),
    icon('integral', 'Integral', ['calculus', 'math', 'area under curve', 'integration', 'formula'], [line('M15.5 4.5c-1.5-1-3.5-.5-3.5 2v11c0 2.5-2 3-3.5 2')], { noAccent: true }),
    icon('square-root', 'Square Root', ['radical', 'math', 'root', 'formula', 'algebra'], [line('M3.5 13H6l3 6.5L14 4.5h6.5')], { noAccent: true }),
    icon('plus-minus', 'Plus Minus', ['tolerance', 'math', 'plus or minus', 'approximate', 'range'], [line('M12 4v9M7.5 8.5h9M7.5 19h9')], { noAccent: true }),
    icon('divide', 'Divide', ['division', 'math', 'calculator', 'operator', 'split'], [line('M5 12h14'), body(C(12, 6.5, 1.5)), body(C(12, 17.5, 1.5))], { noAccent: true }),
    icon('equals', 'Equals', ['equal sign', 'math', 'result', 'same', 'operator'], [line('M5 9h14M5 15h14')], { noAccent: true }),
    icon('not-equal', 'Not Equal', ['inequality', 'math', 'different', 'operator', 'compare'], [line('M5 9h14M5 15h14M15.5 4.5 8.5 19.5')], { noAccent: true }),
    icon('approximately', 'Approximately', ['approx', 'about', 'math', 'roughly', 'estimate'], [line('M5 9.5c2.3-2 4.7-2 7 0s4.7 2 7 0M5 15.5c2.3-2 4.7-2 7 0s4.7 2 7 0')], { noAccent: true }),
    icon('angle', 'Angle', ['geometry', 'degrees', 'math', 'protractor', 'corner'], [line('M17 5 5 19h14'), line(A(5, 19, 6, -49, 0))], { noAccent: true }),
    icon('perpendicular', 'Perpendicular', ['right angle', 'geometry', 'math', 'orthogonal', 'normal'], [line('M12 5v14M4.5 19h15')], { noAccent: true }),
    icon('parallel', 'Parallel', ['parallel lines', 'geometry', 'math', 'equal slope', 'lines'], [line('M9.5 5 6 19M18 5l-3.5 14')], { noAccent: true }),
    icon('less-equal', 'Less Than or Equal', ['inequality', 'math', 'compare', 'at most', 'operator'], [line('M17 4.5 7 9.5l10 5M7 19h10')], { noAccent: true }),
    icon('greater-equal', 'Greater Than or Equal', ['inequality', 'math', 'compare', 'at least', 'operator'], [line('M7 4.5l10 5-10 5M7 19h10')], { noAccent: true }),
    icon('lambda', 'Lambda', ['greek', 'function', 'math', 'physics', 'serverless'], [line('M6 4.5c2 0 3 1 3.8 2.8L17 19.5M12 11.5 6.5 19.5')], { noAccent: true }),
    icon('omega', 'Omega', ['ohm', 'greek', 'resistance', 'math', 'physics'], [line('M4.5 19.5H9v-2a7 7 0 1 1 6 0v2h4.5')], { noAccent: true }),
    icon('percent', 'Percent', ['percentage', 'rate', 'math', 'ratio', 'discount'], [line('M18 5 6 19'), line(C(7.5, 7.5, 2.5) + C(16.5, 16.5, 2.5))], { noAccent: true }),
  ],
};
