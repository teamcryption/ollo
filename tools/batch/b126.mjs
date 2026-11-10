export default {
  interface: [
    `icon('number-input', 'Number Input', ['stepper', 'quantity', 'counter', 'increment', 'form'], [body(R(3, 8, 18, 8, 2.5)), line('M10 8.2v7.6M14 8.2v7.6'), line('M5 12h3M15.5 12h3M17 10.5v3')], { noAccent: true })`,
    `icon('dots-indicator', 'Page Dots', ['carousel dots', 'pagination', 'slides', 'onboarding', 'pager'], [body(R(8, 10.5, 8, 3, 1.5)), line(D(4.5, 12) + D(19.5, 12))], { noAccent: true })`,
    `icon('cookie-banner', 'Cookie Banner', ['cookie consent', 'gdpr', 'privacy notice', 'consent', 'banner'], [body(R(3.5, 4, 17, 16, 2.5)), line('M3.7 14h16.6'), line('M11 17h6'), accent(D(7.5, 17.2))])`,
    `icon('mega-menu', 'Mega Menu', ['navigation menu', 'dropdown menu', 'site nav', 'menu panel', 'website'], [body(R(3.5, 4, 17, 16, 2.5)), line('M3.7 8.5h16.6'), line('M7 12h3M7 15h3M14 12h3M14 15h3')], { noAccent: true })`,
  ],
  media: [
    `icon('slow-motion', 'Slow Motion', ['slow mo', 'playback speed', 'video', 'replay', 'slow'], [body(poly([[10, 6], [19, 12], [10, 18]], 1.2, true)), accent('M3.5 9h3M3.5 12h4M3.5 15h3')])`,
    `icon('djembe', 'Djembe', ['drum', 'percussion', 'african drum', 'rhythm', 'music'], [body(poly([[6.5, 6.3], [17.5, 6.3], [14.5, 12], [16, 20.5], [8, 20.5], [9.5, 12]], 1, true)), body(E(12, 5.3, 6, 1.8), { cover: true })], { noAccent: true })`,
  ],
  logistics: [
    `icon('bubble-wrap', 'Bubble Wrap', ['packaging', 'protective wrap', 'fragile', 'shipping', 'padding'], [body(R(3.5, 4.5, 17, 15, 2.5)), line(C(8, 9.5, 1.6) + C(12, 9.5, 1.6) + C(16, 9.5, 1.6) + C(8, 14.5, 1.6) + C(12, 14.5, 1.6) + C(16, 14.5, 1.6))], { noAccent: true })`,
  ],
  weather: [
    `icon('moon-phase', 'Moon Phases', ['lunar cycle', 'moon', 'astronomy', 'night sky', 'calendar'], [line(C(5.5, 12, 2.5)), line('M12 9.5a2.5 2.5 0 0 1 0 5'), body('M12 9.5a2.5 2.5 0 0 0 0 5Z'), body(C(18.5, 12, 2.5))], { noAccent: true })`,
    `icon('windvane', 'Wind Vane', ['weathervane', 'wind direction', 'weather', 'roof', 'compass'], [line('M12 9v11.5M9.5 20.5h5M8.5 13h7'), line('M4.5 6.5h12'), body(poly([[16.5, 4], [20.5, 6.5], [16.5, 9]], 0.6, true)), line('M4.5 6.5 3.5 4.5M4.5 6.5l-1 2')], { noAccent: true })`,
    `icon('aurora', 'Aurora', ['northern lights', 'aurora borealis', 'night sky', 'arctic', 'polar'], [line('M3.5 8c3-2.5 5.5-2.5 8.5 0s5.5 2.5 8.5 0M3.5 12c3-2.5 5.5-2.5 8.5 0s5.5 2.5 8.5 0'), line('M3.5 20.5 8 16l3 3 3-3 6.5 4.5')], { noAccent: true })`,
  ],
  sports: [
    `icon('barbell', 'Barbell', ['weightlifting', 'gym', 'powerlifting', 'strength', 'weights'], [line('M3 12h1.5M10.2 12h3.6M19.5 12H21'), body(R(4.5, 6.5, 2.5, 11, 1)), body(R(8.2, 8.5, 2, 7, 1)), body(R(13.8, 8.5, 2, 7, 1)), body(R(17, 6.5, 2.5, 11, 1))], { noAccent: true })`,
    `icon('climbing-wall', 'Climbing Wall', ['bouldering', 'rock climbing', 'holds', 'gym', 'adventure'], [body(R(4, 3.5, 16, 17, 2)), line(D(8, 7) + D(15, 8.5) + D(10, 12) + D(16, 15) + D(8, 17.5))], { noAccent: true })`,
    `icon('net', 'Hand Net', ['butterfly net', 'fishing net', 'catch', 'scoop', 'mesh'], [line(C(10, 10, 6)), line('M4.5 10h11M10 4.5v11M6 6l8 8M14 6l-8 8'), line('M14.5 14.5 20.5 20.5')], { noAccent: true })`,
  ],
  travel: [
    `icon('sleeping-bag', 'Sleeping Bag', ['camping', 'sleep', 'outdoors', 'bed roll', 'hiking'], [body(R(6, 3.5, 12, 17, 6)), line(E(12, 8, 3, 2)), line('M12 11.5v6')], { noAccent: true })`,
    `icon('camping-stove', 'Camping Stove', ['camp stove', 'portable burner', 'outdoor cooking', 'hiking', 'gas stove'], [body('M12 4.5c2 2.5 3 4 3 5.5a3 3 0 0 1-6 0c0-1.5 1-3 3-5.5Z'), body(R(6, 15, 12, 3, 1.5)), line('M7 18l-1.5 2.5M17 18l1.5 2.5')], { noAccent: true })`,
  ],
  tools: [
    `icon('gold-pan', 'Gold Pan', ['panning', 'gold rush', 'prospecting', 'mining', 'nuggets'], [body('M3.5 11h17l-2 5.5a2 2 0 0 1-1.9 1.5H7.4a2 2 0 0 1-1.9-1.5Z'), accent(D(10, 8) + D(13.5, 7))])`,
  ],
  buildings: [
    `icon('water-well', 'Water Well', ['well', 'wishing well', 'village', 'water source', 'rural'], [line('M4 8.5 12 4l8 4.5M6 8.5V15M18 8.5V15M12 8.5V11'), body(R(10, 11, 4, 2.8, 0.8)), body(R(4, 15, 16, 5.5, 1.5)), line('M4.2 17.7h15.6')], { noAccent: true })`,
  ],
  nature: [
    `icon('haystack', 'Haystack', ['hay', 'farm', 'harvest', 'straw', 'countryside'], [body('M3.5 19.5c0-6 3.8-11 8.5-11s8.5 5 8.5 11Z'), line('M8 14l1 2M12 12v3M16 14l-1 2')], { noAccent: true })`,
  ],
  education: [
    `icon('asterisk', 'Asterisk', ['star symbol', 'required', 'footnote', 'wildcard', 'multiply'], [line('M12 4.5v15M5.5 8.25l13 7.5M18.5 8.25l-13 7.5')], { noAccent: true })`,
    `icon('pi', 'Pi', ['math', 'constant', 'geometry', 'circle', 'greek'], [line('M4.5 7.5h15M8.5 7.5v12M15.5 7.5V17c0 1.5.8 2.5 2.5 2.5')], { noAccent: true })`,
    `icon('sigma', 'Sigma', ['sum', 'summation', 'math', 'greek', 'total'], [line('M18 5H6l6 7-6 7h12')], { noAccent: true })`,
    `icon('integral', 'Integral', ['calculus', 'math', 'area under curve', 'integration', 'formula'], [line('M15.5 4.5c-1.5-1-3.5-.5-3.5 2v11c0 2.5-2 3-3.5 2')], { noAccent: true })`,
    `icon('square-root', 'Square Root', ['radical', 'math', 'root', 'formula', 'algebra'], [line('M3.5 13H6l3 6.5L14 4.5h6.5')], { noAccent: true })`,
    `icon('plus-minus', 'Plus Minus', ['tolerance', 'math', 'plus or minus', 'approximate', 'range'], [line('M12 4v9M7.5 8.5h9M7.5 19h9')], { noAccent: true })`,
    `icon('divide', 'Divide', ['division', 'math', 'calculator', 'operator', 'split'], [line('M5 12h14'), body(C(12, 6.5, 1.5)), body(C(12, 17.5, 1.5))], { noAccent: true })`,
    `icon('equals', 'Equals', ['equal sign', 'math', 'result', 'same', 'operator'], [line('M5 9h14M5 15h14')], { noAccent: true })`,
    `icon('not-equal', 'Not Equal', ['inequality', 'math', 'different', 'operator', 'compare'], [line('M5 9h14M5 15h14M15.5 4.5 8.5 19.5')], { noAccent: true })`,
    `icon('approximately', 'Approximately', ['approx', 'about', 'math', 'roughly', 'estimate'], [line('M5 9.5c2.3-2 4.7-2 7 0s4.7 2 7 0M5 15.5c2.3-2 4.7-2 7 0s4.7 2 7 0')], { noAccent: true })`,
    `icon('angle', 'Angle', ['geometry', 'degrees', 'math', 'protractor', 'corner'], [line('M17 5 5 19h14'), line(A(5, 19, 6, -49, 0))], { noAccent: true })`,
    `icon('perpendicular', 'Perpendicular', ['right angle', 'geometry', 'math', 'orthogonal', 'normal'], [line('M12 5v14M4.5 19h15')], { noAccent: true })`,
    `icon('parallel', 'Parallel', ['parallel lines', 'geometry', 'math', 'equal slope', 'lines'], [line('M9.5 5 6 19M18 5l-3.5 14')], { noAccent: true })`,
    `icon('less-equal', 'Less Than or Equal', ['inequality', 'math', 'compare', 'at most', 'operator'], [line('M17 4.5 7 9.5l10 5M7 19h10')], { noAccent: true })`,
    `icon('greater-equal', 'Greater Than or Equal', ['inequality', 'math', 'compare', 'at least', 'operator'], [line('M7 4.5l10 5-10 5M7 19h10')], { noAccent: true })`,
    `icon('lambda', 'Lambda', ['greek', 'function', 'math', 'physics', 'serverless'], [line('M6 4.5c2 0 3 1 3.8 2.8L17 19.5M12 11.5 6.5 19.5')], { noAccent: true })`,
    `icon('omega', 'Omega', ['ohm', 'greek', 'resistance', 'math', 'physics'], [line('M4.5 19.5H9v-2a7 7 0 1 1 6 0v2h4.5')], { noAccent: true })`,
    `icon('percent', 'Percent', ['percentage', 'rate', 'math', 'ratio', 'discount'], [line('M18 5 6 19'), line(C(7.5, 7.5, 2.5) + C(16.5, 16.5, 2.5))], { noAccent: true })`,
  ],
};
