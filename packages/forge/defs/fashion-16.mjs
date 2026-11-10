import { icon, body, line, accent } from '../src/dsl.mjs';

export default {
  category: 'fashion',
  icons: [
    icon('bucket-hat', 'Bucket Hat', ['hat', 'fishing hat', 'summer', 'streetwear', 'sun hat'], [body('M7.5 11 8.5 5.5a2 2 0 0 1 2-1.5h3a2 2 0 0 1 2 1.5l1 5.5Z'), line('M7.9 8.8h8.2'), body('M3.5 13c2-1.8 15-1.8 17 0l-2 3.5h-13Z')], { noAccent: true }),
    icon('sandal', 'Sandal', ['flip flop', 'footwear', 'summer', 'beach', 'slipper'], [body('M12 3.5c3 0 4.5 2.5 4.5 6 0 3-1 5-1 7.5S14.5 20.5 12 20.5 8.5 19 8.5 16.5 7.5 12.5 7.5 9.5c0-3.5 1.5-6 4.5-6Z'), line('M6 9.5c4-1.5 8-1.5 12 0M6.5 13c3.5 1 7.5 1 11 0')], { noAccent: true }),
  ],
};
