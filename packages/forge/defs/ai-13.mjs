import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, star } from '../src/geo.mjs';

const spark = (x, y, r) => accent(star(x, y, r, r * 0.32, 4, 0.2));

export default {
  category: 'ai',
  icons: [
    icon('ai-sheet', 'AI Spreadsheet', ['smart sheet', 'ai formulas', 'table ai', 'data assistant', 'spreadsheet'], [body(R(3, 6, 13.5, 13.5, 2.5)), line('M3.2 10.5h13.1M3.2 15h13.1M8.5 6.2v13.1'), spark(19.5, 5, 2)], { anim: 'pulse' }),
    icon('ai-dashboard', 'AI Dashboard', ['smart analytics', 'insights hub', 'ai overview', 'metrics', 'monitoring'], [body(R(3, 6, 6, 6, 1.5)), body(R(11, 6, 5.5, 13.5, 1.5)), body(R(3, 14, 6, 5.5, 1.5)), spark(19.5, 4.5, 2)], { anim: 'pulse' }),
    icon('ai-plant', 'AI Agriculture', ['smart farming', 'agritech', 'crop ai', 'growth', 'plant'], [line('M9.5 20.5V11'), body('M9.5 11c0-3.5 2.5-6 6-6.2.2 3.6-2.4 6.2-6 6.2Z'), body('M9.5 13.5c0-2.8-2-4.8-4.8-5-.2 2.8 1.9 5 4.8 5Z'), line('M5 20.5h9'), spark(19.5, 10.5, 1.8)], { anim: 'pulse' }),
  ],
};
