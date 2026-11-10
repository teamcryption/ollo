const Z = `{ noAccent: true }`;
export default {
  home: [
    `icon('food-processor', 'Food Processor', ['chopper', 'kitchen appliance', 'blend', 'prep', 'mixer'], [body(poly([[6, 6.5], [18, 6.5], [17, 14.3], [7, 14.3]], 1, true)), line('M14 6.5V3.5h3v3'), line('M9.5 10.5h5'), body(R(5, 15.5, 14, 5, 1.5))], ${Z})`,
    `icon('coffee-grinder', 'Coffee Grinder', ['grinder', 'coffee beans', 'barista', 'manual grinder', 'kitchen'], [line('M12 7V4.5h4.5'), body(C(17.6, 4.5, 1.2)), body(poly([[7, 7], [17, 7], [15.5, 9.8], [8.5, 9.8]], 0.6, true)), body(R(6, 11, 12, 9.5, 1.5)), line('M9.5 16h5')], ${Z})`,
    `icon('deep-fryer', 'Deep Fryer', ['fryer', 'frying', 'fries', 'kitchen appliance', 'oil'], [body(R(4, 9, 13, 11, 2)), line('M4.2 12.5h12.6'), line('M17 10 20.5 6.5')], ${Z})`,
    `icon('dishwasher', 'Dishwasher', ['dishes', 'kitchen appliance', 'clean', 'washing', 'cycle'], [body(R(5, 3.5, 14, 17, 1.5)), line('M5.2 7.5h13.6'), line(D(8, 5.5) + D(10.5, 5.5)), accent(L(10, 11, 14, 11))])`,
    `icon('freezer', 'Chest Freezer', ['freezer', 'frozen food', 'deep freeze', 'cold storage', 'appliance'], [body(R(3.5, 8, 17, 12, 1.5)), line('M3.7 11.5h16.6'), accent(L(10, 15, 14, 15))])`,
    `icon('kitchen-scale', 'Kitchen Scale', ['food scale', 'weigh', 'baking', 'grams', 'measure'], [body('M5.5 9h13c0 2-2.9 3.2-6.5 3.2S5.5 11 5.5 9Z'), body(R(4, 13, 16, 7, 2)), line(R(9, 15.3, 6, 2.5, 0.8))], ${Z})`,
    `icon('meat-thermometer', 'Meat Thermometer', ['probe thermometer', 'cooking temperature', 'bbq', 'roast', 'kitchen'], [body(C(12, 8, 4.5)), line('M12 8l2-2'), line('M12 12.5v8')], ${Z})`,
    `icon('hand-blender', 'Hand Blender', ['immersion blender', 'stick blender', 'soup', 'puree', 'kitchen'], [body(R(9.5, 3.5, 5, 10, 2.5)), line(D(12, 6.5)), line('M12 13.5v3'), body('M9 16.5h6l-.8 3.5a1 1 0 0 1-1 .8h-2.4a1 1 0 0 1-1-.8Z')], ${Z})`,
  ],
  health: [
    `icon('otoscope', 'Otoscope', ['ear exam', 'doctor', 'ent', 'checkup', 'medical device'], [body(R(8, 6, 6.5, 4.5, 1.5)), body(poly([[14.5, 6.8], [19.5, 7.5], [19.5, 9], [14.5, 9.7]], 0.5, true)), body(R(9, 11.5, 4.5, 9, 1.5))], ${Z})`,
    `icon('pulse-oximeter', 'Pulse Oximeter', ['oxygen saturation', 'spo2', 'finger clip', 'vitals', 'monitor'], [body(R(4, 8, 16, 9, 3)), line(R(7, 10.5, 6, 4, 0.8)), line('M16 10.5v4')], ${Z})`,
    `icon('test-strip', 'Test Cassette', ['rapid test', 'lateral flow', 'covid test', 'diagnostic', 'result'], [body(R(3.5, 8.5, 17, 7, 2)), line(R(7, 10.5, 6, 3, 1)), line('M9 10.7v2.6M11 10.7v2.6'), line(C(16.5, 12, 1.5))], ${Z})`,
  ],
  science: [
    `icon('microscope-slide', 'Microscope Slide', ['slide', 'specimen', 'lab', 'sample', 'biology'], [body(R(3.5, 8.5, 17, 7, 1.5)), line(R(5.5, 10.5, 4, 3, 0.5)), accent(C(14.5, 12, 2))])`,
  ],
};
