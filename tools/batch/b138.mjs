const Z = `{ noAccent: true }`;
export default {
  transport: [
    `icon('piston', 'Piston', ['engine', 'motor', 'cylinder', 'mechanic', 'car parts'], [body(R(6, 3.5, 12, 7, 1.5)), line('M6.2 6h11.6'), line('M12 10.5v5.5'), body(C(12, 18.5, 2.5))], ${Z})`,
    `icon('windshield-wiper', 'Windshield Wiper', ['wiper', 'windscreen', 'rain', 'car', 'visibility'], [line('M3.5 18.5c2-6 5.2-9 8.5-9s6.5 3 8.5 9'), line('M12 18.5 6.8 11.5'), body(C(12, 19, 1.5))], ${Z})`,
    `icon('car-seat', 'Car Seat', ['seat', 'driver seat', 'vehicle interior', 'upholstery', 'car'], [body(poly([[6, 4], [10, 4], [11, 13], [18, 13.5], [18, 17], [7, 17]], 1.2, true)), line('M8 17v3.5M16 17v3.5')], ${Z})`,
    `icon('car-door', 'Car Door', ['door', 'vehicle', 'open door', 'car body', 'entry'], [body('M4 9.5 9 4.5h10.5v15H4Z'), line('M7 9.5 10 6.5h7v3Z'), accent('M14 14h3')])`,
  ],
  travel: [
    `icon('door-hanger', 'Door Hanger', ['do not disturb', 'hotel', 'privacy sign', 'room', 'please clean'], [body('M8 3.5h8a1.5 1.5 0 0 1 1.5 1.5v14.5A1.5 1.5 0 0 1 16 21H8a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 8 3.5Z'), line(C(12, 7.5, 2)), accent('M9.5 13.5h5M9.5 16.5h3')])`,
  ],
  security: [
    `icon('skeleton-key', 'Skeleton Key', ['old key', 'vintage key', 'master key', 'unlock', 'antique'], [line(C(6.5, 12, 3)), line('M9.5 12h11M17 12v3M20 12v2.5')], ${Z})`,
  ],
};
