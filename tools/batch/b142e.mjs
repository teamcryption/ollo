const DIA = `body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true))`;
const TRI = `body(poly([[12, 3.5], [21, 19.5], [3, 19.5]], 1.5, true))`;
export default {
  transport: [
    `icon('road-merge', 'Merging Traffic', ['merge', 'road sign', 'lanes join', 'warning', 'driving'], [${DIA}, accent('M13 16.5V8.5M9.5 15c0-2.2 3.5-2.6 3.5-4.8')])`,
    `icon('dead-end', 'Dead End', ['no through road', 'road sign', 'cul de sac', 'warning', 'driving'], [${DIA}, accent('M9 9h6M12 9v7')])`,
    `icon('steep-grade', 'Steep Grade', ['steep hill', 'road sign', 'gradient', 'warning', 'incline'], [${TRI}, accent(poly([[8.5, 17], [15.5, 11.5], [15.5, 17]], 0.6, true))])`,
  ],
};
