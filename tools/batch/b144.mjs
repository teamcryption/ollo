const Z = `{ noAccent: true }`;
const DIA = `body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true))`;
const NO = (glyph) => `${glyph}, line('M6 6l12 12'), line(C(12, 12, 8.5))`;
const T = (a) => a.map((t) => `'${t}'`).join(', ');
const no = (name, title, tags, glyph) => `icon('${name}', '${title}', [${T(tags)}, 'prohibited', 'sign'], [${NO(glyph)}], ${Z})`;
const dia = (name, title, tags, d) => `icon('${name}', '${title}', [${T(tags)}, 'road sign', 'driving'], [${DIA}, accent(scaleD(${d}, 0.85, 12, 12))])`;
export default {
  food: [
    no('no-gluten', 'Gluten Free', ['gluten free', 'wheat', 'celiac', 'allergen', 'diet'], `line('M12 17V8M12 10.5c-1.5 0-2.5-1-2.5-2.5 1.5 0 2.5 1 2.5 2.5Zm0 0c1.5 0 2.5-1 2.5-2.5-1.5 0-2.5 1-2.5 2.5Zm0 3c-1.5 0-2.5-1-2.5-2.5 1.5 0 2.5 1 2.5 2.5Zm0 0c1.5 0 2.5-1 2.5-2.5-1.5 0-2.5 1-2.5 2.5Z')`),
    no('no-dairy', 'Dairy Free', ['lactose free', 'milk', 'vegan', 'allergen', 'diet'], `body('M10 7h4v1.5l1.5 2v6.5h-7v-6.5L10 8.5Z')`),
    no('no-nuts', 'Nut Free', ['peanut free', 'allergy', 'nuts', 'allergen', 'diet'], `body('M12 7c2 0 3 1.4 3 2.8 0 1-.7 1.5-.7 2.2s.7 1.2.7 2.2c0 1.4-1 2.8-3 2.8s-3-1.4-3-2.8c0-1 .7-1.5.7-2.2S9 10.8 9 9.8C9 8.4 10 7 12 7Z')`),
    no('no-sugar', 'Sugar Free', ['no added sugar', 'diabetic', 'sweet', 'diet', 'sugar cube'], `body(R(8.5, 8.5, 7, 7, 1.2)), line('M8.7 12h6.6')`),
    no('no-meat', 'No Meat', ['vegetarian', 'meat free', 'veggie', 'diet', 'drumstick'], `body('M13.5 7.5a3 3 0 0 1 2 5.2l-3.3 3.3-2.2-2.2 3.3-3.3a3 3 0 0 1 .2-3Z'), line('M10 14l-2 2M8.2 15.2l-1 1')`),
    no('no-eggs', 'Egg Free', ['egg allergy', 'vegan', 'eggs', 'allergen', 'diet'], `body(E(12, 12.3, 3.3, 4.3))`),
    no('no-fish', 'No Fish', ['fish free', 'seafood allergy', 'vegetarian', 'allergen', 'diet'], `body('M7 12c1.5-2 3.3-3 5.2-3 2.6 0 4.3 2 4.3 3s-1.7 3-4.3 3C10.3 15 8.5 14 7 12Z'), line('M7 12 5.5 10.5M7 12l-1.5 1.5')`),
    no('no-caffeine', 'Caffeine Free', ['decaf', 'no coffee', 'caffeine', 'diet', 'sleep'], `body('M8 9h7v4a3.5 3.5 0 0 1-7 0Z'), line('M15 10h1a1.5 1.5 0 0 1 0 3h-1')`),
    no('no-plastic', 'No Plastic', ['plastic free', 'zero waste', 'eco', 'single use', 'bottle'], `body('M10.5 6.5h3v1.5l1 1.5v8h-5v-8l1-1.5Z')`),
  ],
  sports: [
    no('no-swimming', 'No Swimming', ['swimming prohibited', 'water', 'beach'], `line('M7 14.5c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0 2.3-1 3 0'), body(C(12, 10, 1.6))`),
    no('no-hunting', 'No Hunting', ['hunting prohibited', 'wildlife', 'reserve'], `line(C(12, 12, 3.5)), line('M12 7v2M12 15v2M7 12h2M15 12h2')`),
  ],
  devices: [no('no-drones', 'No Drones', ['drones prohibited', 'no fly zone', 'uav'], `line(C(8.5, 8.5, 1.5) + C(15.5, 8.5, 1.5) + C(8.5, 15.5, 1.5) + C(15.5, 15.5, 1.5)), body(R(10.5, 10.5, 3, 3, 0.8))`)],
  finance: [no('no-tipping', 'No Tipping', ['tips not accepted', 'gratuity', 'coins'], `body(C(12, 12, 3.8)), line('M12 10v4')`)],
  health: [no('no-smoking', 'No Smoking', ['smoking prohibited', 'smoke free', 'cigarette'], `body(R(6.5, 12, 9, 2.5, 0.6)), line('M16 12v2.5M15.5 9.5c0-1 1-1.2 1-2.2')`)],
  people: [no('no-strollers', 'No Strollers', ['pushchairs prohibited', 'prams', 'baby'], `line('M8 8h2.5l1 4H16a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3Z'), line(D(9.5, 16.8) + D(14.5, 16.8))`)],
  travel: [no('no-luggage', 'No Luggage', ['bags prohibited', 'suitcase', 'baggage'], `line('M10.5 8.5V7.5h3v1'), body(R(8.5, 8.5, 7, 8.5, 1.2))`)],
  transport: [
    no('no-scooters', 'No Scooters', ['scooters prohibited', 'e-scooter', 'pavement'], `line('M9 16.5h6.5L14 8h1.5'), line(D(8.5, 16.8) + D(15.8, 16.8))`),
    no('no-horn', 'No Horn', ['no honking', 'quiet zone', 'hospital zone'], `body('M7 10.5h2.5L15 7.5v9l-5.5-3H7Z')`),
    dia('hairpin-curve', 'Hairpin Curve', ['sharp bend', 'switchback', 'turn'], `'M9.5 16V11a2.5 2.5 0 0 1 5 0v1.5M13 11l1.5 1.5L16 11'`),
    dia('loose-gravel', 'Loose Gravel', ['gravel road', 'loose chippings', 'stones'], `D(9.5, 14) + D(12, 15.5) + D(14.5, 14) + D(11, 12) + D(13.5, 11.5)`),
    dia('flood-zone', 'Flood Zone', ['flooding', 'water on road', 'ford'], `'M8.5 11c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0M8.5 14c1.2-1 2.3-1 3.5 0s2.3 1 3.5 0'`),
    dia('tunnel-ahead', 'Tunnel Ahead', ['tunnel', 'underpass', 'headlights'], `'M8.5 16v-3a3.5 3.5 0 0 1 7 0v3'`),
    dia('lane-ends', 'Lane Ends', ['merge left', 'lane closed', 'narrowing'], `'M9.5 16V8M14.5 16v-3.5L12 10V8'`),
    dia('stop-ahead', 'Stop Ahead', ['stop sign ahead', 'junction', 'halt'], `poly([[10.5, 8.5], [13.5, 8.5], [15.5, 10.5], [15.5, 13.5], [13.5, 15.5], [10.5, 15.5], [8.5, 13.5], [8.5, 10.5]], 0.4, true)`),
  ],
  logistics: [
    `icon('fragile', 'Fragile', ['handle with care', 'breakable', 'glass', 'shipping label', 'parcel'], [line('M8.5 3.5h7c0 5-1.5 8-3.5 8s-3.5-3-3.5-8ZM12 11.5v8M9 19.5h6')], ${Z})`,
    `icon('this-side-up', 'This Side Up', ['upright', 'orientation', 'shipping label', 'parcel', 'handling'], [line('M8.5 18V7M6 9.5 8.5 7 11 9.5M15.5 18V7M13 9.5 15.5 7 18 9.5M5 20.5h14')], ${Z})`,
    `icon('keep-dry', 'Keep Dry', ['protect from rain', 'waterproof', 'shipping label', 'parcel', 'handling'], [line('M4.5 12.5a7.5 7.5 0 0 1 15 0ZM12 12.5v5.5a1.5 1.5 0 0 0 3 0'), accent('M8 3.5v1.5M16 3.5v1.5')])`,
  ],
};
