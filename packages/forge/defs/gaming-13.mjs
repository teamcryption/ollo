import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C } from '../src/geo.mjs';

export default {
  category: 'gaming',
  icons: [
    icon('roller-coaster', 'Roller Coaster', ['theme park', 'ride', 'amusement park', 'thrill', 'fair'], [line('M3 16.5c2 0 3-9.5 6-9.5s3.5 8 6 8 3-4.5 6-4.5'), line('M9 9.5v11M15 17v3.5M3.5 20.5h17')], { noAccent: true }),
    icon('unicycle', 'Unicycle', ['circus', 'balance', 'cycle', 'performer', 'one wheel'], [body(R(9, 4, 6, 2.5, 1.25)), line('M12 6.5v10'), line(C(12, 16.5, 4))], { noAccent: true }),
    icon('claw-machine', 'Claw Machine', ['crane game', 'arcade', 'prize', 'toy grabber', 'game'], [body(R(5, 3, 14, 18, 2)), line(R(7.5, 5.5, 9, 8, 1)), line('M10 17h4'), accent('M12 7.5v2M10.5 11.5l1.5-2 1.5 2')]),
  ],
};
