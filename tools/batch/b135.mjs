const Z = `{ noAccent: true }`;
export default {
  sports: [
    `icon('pennant', 'Pennant', ['team flag', 'fan', 'banner', 'school spirit', 'victory'], [line('M5 3.5v17'), body(poly([[5.5, 5], [19.5, 8.5], [5.5, 12]], 0.8, true))], ${Z})`,
    `icon('diving-board', 'Diving Board', ['pool', 'dive', 'swimming', 'springboard', 'jump'], [body(R(3.5, 7.5, 12, 2.5, 1.25)), line('M5.5 10v10.5M13 10v10.5M16.5 10v10.5M13 13.5h3.5M13 17h3.5')], ${Z})`,
    `icon('flippers', 'Flippers', ['fins', 'diving', 'snorkelling', 'swimming', 'scuba'], [body('M4.5 4.5h4l1.5 13.5c0 1.5-1.5 2.5-3.5 2.5S3 19.5 3 18Z'), body('M15.5 4.5h4L21 18c0 1.5-1.5 2.5-3.5 2.5S14 19.5 14 18Z')], ${Z})`,
    `icon('fishing-float', 'Fishing Float', ['bobber', 'fishing', 'angling', 'lake', 'bite'], [line('M12 8V3.5'), body(C(12, 13, 5)), line('M7.2 13h9.6'), accent('M3.5 20.5c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0')])`,
  ],
  education: [
    `icon('glue-stick', 'Glue Stick', ['glue', 'craft', 'school', 'stationery', 'stick'], [body(R(8, 3.5, 8, 4.5, 1.2)), body(R(8, 9, 8, 11.5, 1.5)), line('M8.2 13h7.6')], ${Z})`,
  ],
  fashion: [
    `icon('bobby-pin', 'Bobby Pin', ['hair pin', 'hairgrip', 'hair accessory', 'clip', 'styling'], [line('M4 10.5c1.3-1 2.7-1 4 0s2.7 1 4 0 2.7-1 4 0h1.5a2.5 2.5 0 0 1 0 5H4')], ${Z})`,
    `icon('hair-curler', 'Hair Curler', ['roller', 'curls', 'hairdresser', 'styling', 'salon'], [body(R(5, 7, 14, 10, 5)), line('M9 7.3v9.4M12 7.3v9.4M15 7.3v9.4')], ${Z})`,
    `icon('captain-hat', 'Captain Hat', ['sailor hat', 'skipper', 'nautical', 'pilot cap', 'navy'], [body('M4.5 13c0-4 3.4-7 7.5-7s7.5 3 7.5 7Z'), body(R(4, 14, 16, 3, 1.5)), accent(star(12, 9.7, 1.4, 0.6, 5, 0.2))])`,
  ],
  health: [
    `icon('tweezers', 'Tweezers', ['tweezer', 'pluck', 'splinter', 'beauty', 'precision'], [line('M12 3.5 8 17.5l1 3M12 3.5l4 14-1 3')], ${Z})`,
    `icon('cotton-swab', 'Cotton Swab', ['cotton bud', 'q-tip', 'ear cleaning', 'hygiene', 'makeup'], [line('M7.2 16.8 16.8 7.2'), body(rotateD(E(5.5, 18.5, 1.6, 2.6), 45, 5.5, 18.5)), body(rotateD(E(18.5, 5.5, 1.6, 2.6), 45, 18.5, 5.5))], ${Z})`,
  ],
  home: [
    `icon('toilet-paper', 'Toilet Paper', ['tissue roll', 'bathroom', 'loo roll', 'hygiene', 'supplies'], [body(C(8, 10, 4.5)), line(C(8, 10, 1.5)), line('M8 5.5h7.5a4.5 4.5 0 0 1 4.5 4.5v10M12.5 10v10H20')], ${Z})`,
    `icon('umbrella-stand', 'Umbrella Stand', ['umbrellas', 'hallway', 'entrance', 'rain', 'storage'], [line('M10 10V5.5a1.8 1.8 0 0 0-3.6 0M14.5 10V4.5a1.8 1.8 0 0 1 3.6 0'), body(R(7, 10, 10, 10.5, 2))], ${Z})`,
    `icon('bean-bag', 'Bean Bag', ['beanbag chair', 'lounge', 'seat', 'relax', 'furniture'], [body('M4 18c-1-4 1.5-9 5-11s7-1 9 2 3 7 1.5 9c-1.5 1.5-6 2.5-9 2.5S4.5 19.5 4 18Z'), line('M9 9.5c1.5 1.5 4 1.5 5.5 0')], ${Z})`,
    `icon('doorknob', 'Doorknob', ['door handle', 'knob', 'entrance', 'open door', 'hardware'], [body(R(4, 6, 3.5, 12, 1.5)), line('M7.5 12H11'), body(C(14.5, 12, 3.5))], ${Z})`,
  ],
  food: [
    `icon('ice-tray', 'Ice Tray', ['ice cube tray', 'freezer', 'frozen', 'kitchen', 'cold'], [body(R(3.5, 8, 17, 8, 2)), line('M3.7 12h16.6M7.75 8.2v7.6M12 8.2v7.6M16.25 8.2v7.6')], ${Z})`,
  ],
  travel: [
    `icon('canteen', 'Canteen', ['water flask', 'hiking', 'military', 'camping', 'drink'], [body(R(10, 3.5, 4, 3, 1)), body(C(12, 13.5, 6.5)), line('M6 8.5C4.5 7 4 5 4.5 3.5M18 8.5c1.5-1.5 2-3.5 1.5-5')], ${Z})`,
  ],
  people: [
    `icon('sippy-cup', 'Sippy Cup', ['baby cup', 'toddler', 'feeding', 'drink', 'kids'], [body('M7 10c0-1.7 1.3-3 3-3h1l1-3.5h1.5L14 7c1.7 0 3 1.3 3 3Z'), body(R(7, 11, 10, 9.5, 2.5)), line('M7 13.5H5.5v3H7M17 13.5h1.5v3H17')], ${Z})`,
  ],
  gaming: [
    `icon('jack-in-box', 'Jack in the Box', ['toy', 'surprise', 'spring toy', 'kids', 'clown box'], [body(C(12, 5, 2.2)), line('M12 13l-2-1.3 4-1.3-4-1.3 2-1.3'), body(R(5, 13, 14, 7.5, 1.5))], ${Z})`,
  ],
  animals: [
    `icon('seagull', 'Seagull', ['gull', 'birds', 'sea bird', 'coast', 'flying'], [line('M3.5 9c2.5-1.5 5.5-1 8.5 2.5 3-3.5 6-4 8.5-2.5'), accent('M13 16.5c1-.7 2.3-.5 3.5.8 1.2-1.3 2.5-1.5 3.5-.8')])`,
  ],
};
