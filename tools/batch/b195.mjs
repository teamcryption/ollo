import { B } from './mods.mjs';
Object.assign(B, {
  'user-circle': `line(C(9.5, 10.5, 6.5)), body(C(9.5, 8.5, 2.2)), line('M5.5 15.5a4.5 4.5 0 0 1 8 0')`,
  'baby': `body(C(9.5, 10.5, 6)), line(D(7.5, 10) + D(11.5, 10)), line('M8 13a2 2 0 0 0 3 0M9.5 4.5c-1-1 0-2 1-1.5')`,
  'elderly': `body(C(8, 4.5, 1.8)), line('M8 7v5l-1.5 6M8 12l2 6M8 8.5l3 2'), line('M12.5 10.5V18')`,
  'pregnant': `body(C(8.5, 4.5, 1.8)), body('M7.5 7.5h2c2.5 1 3.5 2.5 3.5 4.5s-1 3-3 3h-2Z'), line('M8 15v3M10 15v3')`,
  'couple': `body(C(6.5, 5, 1.8)), body(C(12.5, 5, 1.8)), line('M4 17.5v-6.5a2.5 2.5 0 0 1 5 0v6.5M10 17.5v-6.5a2.5 2.5 0 0 1 5 0v6.5')`,
  'person-walking': `body(C(10.5, 4, 1.8)), line('M10 7l-1.5 5 2.5 2 .5 4M8.5 12 6.5 18M9.5 8.5l2.5 2 2 .5M9.5 8.5 7 10.5')`,
  'person-raising-hand': `body(C(8, 6, 1.8)), line('M8 9v5l-1.5 4M8 14l1.5 4M8 10l-2.5 2M8 9.5l3.5-3 1-3.5')`,
  'person-presenting': `body(C(5, 6, 1.8)), line('M5 9v4.5L4 18M5 13.5 6 18M5 10l3-1.5'), body(R(9, 3.5, 7.5, 6, 0.8)), line('M12.75 9.7V12')`,
  'meditation': `body(C(9.5, 4.5, 1.8)), line('M9.5 7.5v4.5M6 10l3.5 2 3.5-2'), line('M3.5 15c2 0 4-1 6-3 2 2 4 3 6 3')`,
  'speaking-head': `body('M10 3.5a5 5 0 0 1 5 5c0 1.5-.5 2.5-1 3.5v5.5H9.5v-2.5H7.5a1.5 1.5 0 0 1-1.5-1.5V12l-1.5-.5 1.5-2.5A5 5 0 0 1 10 3.5Z'), line('M2.5 7l-1-1M2.5 10H1')`,
  'thumbs-up': `body('M6 9.5 9 3.5c1 0 2 .7 2 2V8h3.5a1.5 1.5 0 0 1 1.5 1.8l-1 6a1.5 1.5 0 0 1-1.5 1.2H6Z'), body(R(2.5, 9.5, 3, 7.5, 0.8))`,
  'wave-hand': `body('M7 18c-2.5-1-4-3.5-4-6V8.5a1 1 0 0 1 2 0V11V5a1 1 0 0 1 2 0v5.5V4a1 1 0 0 1 2 0v6.5V5a1 1 0 0 1 2 0v6.5l1-1.5a1 1 0 0 1 1.7 1L12.5 15c-1 2-3 3-5.5 3Z'), line('M14.5 3c1 .5 1.7 1.3 2 2.5')`,
  'peace-hand': `body('M6 18c-1.5-1-2.5-2.5-2.5-4.5v-2a1.5 1.5 0 0 1 3 0V12L5.5 4.5a1 1 0 0 1 2-.3l1.5 6 1.5-6a1 1 0 0 1 2 .3l-1 7.5h1a2 2 0 0 1 2 2v.5c0 2-1.5 3.5-3.5 3.5Z')`,
  'cinnamon-roll': `line(C(9.5, 10.5, 6.5)), line('M9.5 10.5a1.3 1.3 0 0 1 2.6 0 2.6 2.6 0 0 1-5.2 0 3.9 3.9 0 0 1 7.8 0')`,
  'coffee-to-go': `body(R(5, 3, 9, 3, 1)), body(poly([[5.5, 6.5], [13.5, 6.5], [12.5, 18], [6.5, 18]], 0.6, true)), line('M6 10.5h7M6.3 13.5h6.4')`,
  'car-side': `body('M2.5 13.5v-2.5l2-4h8l2.5 4h1.5v2.5Z'), line('M5 10.5h9'), line(C(6, 14.5, 1.6) + C(13, 14.5, 1.6))`,
  'pickup-truck': `body('M2.5 14V9.5h8V6h3.5l2.5 3.5V14Z'), line(C(5.5, 15, 1.6) + C(13, 15, 1.6))`,
  'van': `body('M2.5 14V6a1.5 1.5 0 0 1 1.5-1.5h8L16.5 9v5Z'), line('M12 4.7V9h4.3'), line(C(5.5, 15, 1.6) + C(13, 15, 1.6))`,
  'bulldozer': `body(R(5, 6, 6, 5, 1)), body(R(3, 11, 10, 4, 2)), line('M13 9h2l1.5 6'), line(D(5.5, 13) + D(10.5, 13))`,
  'excavator': `body(R(3, 9, 7, 4, 1)), body(R(2.5, 14, 9, 3, 1.5)), line('M10 10l3-5 3 4'), body('M16 9.5l1 3h-3Z')`,
  'airport': `line('M3 17.5h13'), body('M9.5 3c.8 0 1.2.8 1.2 1.8V8l4.3 2.5V12l-4.3-1.3v2.8l1.5 1.2V16l-2.7-.8-2.7.8v-1.3l1.5-1.2v-2.8L4 12v-1.5L8.3 8V4.8c0-1 .4-1.8 1.2-1.8Z')`,
  'gas-pump': `body(R(4, 3.5, 8, 14.5, 1.2)), line(R(5.8, 5.5, 4.4, 3.5, 0.5)), line('M12 9h1.5a1 1 0 0 1 1 1v5a1.2 1.2 0 0 0 2.4 0V7.5L15 5.5'), line('M3 18h10')`,
  'receipt-long': `body('M5 3h9v15l-1.5-1-1.5 1-1.5-1-1.5 1-1.5-1L5 18Z'), line('M7.5 6.5h4M7.5 9h4M7.5 11.5h2.5')`,
  'price-up': `body('M3 4.5A1.5 1.5 0 0 1 4.5 3h4.8a1.5 1.5 0 0 1 1.1.4l5 5a1.5 1.5 0 0 1 0 2.2l-4.6 4.6a1.5 1.5 0 0 1-2.2 0l-5-5A1.5 1.5 0 0 1 3 9.1Z'), line('M7.5 12l3-3M8.5 9h2v2')`,
  'vending-machine': `body(R(4, 3, 11, 15, 1.5)), line(R(5.8, 5, 5, 8, 0.5)), line('M13 6v1M13 9v1'), line('M6 15.5h5')`,
  'basket-full': `line('M3 8.5h13M6 8.5 8.5 3.5M13 8.5 10.5 3.5'), body('M3.5 9h12l-1.3 7.7a1.5 1.5 0 0 1-1.5 1.3H6.3a1.5 1.5 0 0 1-1.5-1.3Z'), line('M7 11.5v3.5M9.5 11.5v3.5M12 11.5v3.5')`,
  'marketplace': `body(poly([[3, 8], [4.5, 4], [14.5, 4], [16, 8]], 0.5, true)), line('M3 8c0 1.5 1 2 2.2 2s2.2-.5 2.2-2c0 1.5 1 2 2.1 2s2.1-.5 2.1-2c0 1.5 1 2 2.2 2S16 9.5 16 8'), line('M4.5 10.5V18h10v-7.5')`,
  'loyalty-card': `body(R(3, 5, 13, 11, 1.5)), body(star(9.5, 10.5, 3, 1.3, 5, 0.3))`,
});
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, { 'user-circle': 'people', baby: 'people', elderly: 'people', pregnant: 'people', couple: 'people', 'person-walking': 'people', 'person-raising-hand': 'people', 'person-presenting': 'people', meditation: 'health', 'speaking-head': 'people', 'thumbs-up': 'social', 'wave-hand': 'social', 'peace-hand': 'social', 'cinnamon-roll': 'food', 'coffee-to-go': 'food', 'wine-barrel': 'food', 'car-side': 'transport', 'pickup-truck': 'transport', van: 'transport', bulldozer: 'tools', excavator: 'tools', airport: 'travel', 'gas-pump': 'transport', roadblock: 'transport', 'receipt-long': 'commerce', 'price-up': 'commerce', 'vending-machine': 'commerce', 'basket-full': 'commerce', marketplace: 'commerce', 'loyalty-card': 'commerce' });
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, { 'user-circle': 'Avatar', 'person-walking': 'Walking', 'person-raising-hand': 'Raise Hand', 'person-presenting': 'Presenter', 'speaking-head': 'Speaking', 'wave-hand': 'Wave', 'peace-hand': 'Peace' });
export default {};
