import { combos } from './mods.mjs';
const Z = `{ noAccent: true }`;
const out = {
  fashion: [
    `icon('mascara', 'Mascara', ['makeup', 'lashes', 'cosmetics', 'beauty', 'wand'], [body(E(12, 5.5, 1.6, 2.5)), line('M12 8v2'), body(R(9, 10, 6, 10.5, 1.5))], ${Z})`,
    `icon('compact-mirror', 'Compact Mirror', ['makeup mirror', 'powder compact', 'beauty', 'cosmetics', 'pocket mirror'], [line(C(12, 7.5, 4)), line(C(12, 7.5, 2.2)), body(C(12, 16.5, 4))], ${Z})`,
    `icon('makeup-brush', 'Makeup Brush', ['blush brush', 'cosmetics', 'beauty', 'powder', 'makeup'], [...rot([body('M9 4c0-.5 6-.5 6 0l-.5 5h-5Z'), body(R(9.5, 10, 5, 2.5, 0.5)), body('M10.5 13.5h3l-.5 7h-2Z')], 30)], ${Z})`,
    `icon('face-cream', 'Face Cream', ['moisturiser', 'skincare', 'jar', 'beauty', 'lotion'], [body(R(5, 7, 14, 3.5, 1.2)), body(R(5.5, 11.5, 13, 8.5, 2.5)), line('M8.5 15.5h7')], ${Z})`,
    `icon('serum-bottle', 'Serum Bottle', ['dropper bottle', 'skincare', 'essential oil', 'beauty', 'serum'], [body(E(12, 4.8, 1.8, 1.3)), body(R(9.5, 7, 5, 2.5, 0.8)), body(R(7.5, 10.5, 9, 10, 2.5))], ${Z})`,
    `icon('shower-cap', 'Shower Cap', ['bath cap', 'hair', 'bathroom', 'hotel', 'spa'], [body('M4 14c0-4.5 3.6-8 8-8s8 3.5 8 8Z'), line('M3.5 15.5c1 1 2 1 3 0s2-1 3 0 2 1 3 0 2-1 3 0 2 1 3 0')], ${Z})`,
    `icon('barber-pole', 'Barber Pole', ['barbershop', 'haircut', 'salon', 'grooming', 'barber'], [body(R(8, 3.5, 8, 1.8, 0.9)), body(R(9, 6.3, 6, 11.4, 1)), line('M9.2 10l5.6-2.5M9.2 13.5l5.6-2.5M9.2 17l5.6-2.5'), body(R(8, 18.7, 8, 1.8, 0.9))], ${Z})`,
  ],
  home: [
    `icon('incense', 'Incense', ['incense stick', 'aroma', 'meditation', 'spa', 'fragrance'], [line('M7 18.5 16.5 9'), body(R(4, 18.5, 16, 2, 1)), accent('M17.5 6.5c-1-1 0-2 1-2.7s0-1.8-1-2.3')])`,
  ],
  animals: [
    `icon('dog-bowl', 'Pet Bowl', ['dog bowl', 'cat food', 'feeding', 'pet', 'kibble'], [line('M6.5 13c1-1.5 2.5-2 3.5-1.5 1-1 3-1 4 0 1-.5 2.5 0 3.5 1.5'), body('M4 13h16l-1.5 6a1.5 1.5 0 0 1-1.5 1H7a1.5 1.5 0 0 1-1.5-1Z')], ${Z})`,
    `icon('pet-carrier', 'Pet Carrier', ['cat carrier', 'pet travel', 'crate', 'vet visit', 'pet'], [line('M9 8V6h6v2'), body(R(3.5, 8, 17, 12, 2)), line(R(6, 11, 7, 6, 1)), line('M8.3 11.2v5.6M10.7 11.2v5.6')], ${Z})`,
    `icon('pet-collar', 'Pet Collar', ['dog collar', 'name tag', 'pet id', 'pet', 'leash'], [line(E(12, 9, 7.5, 3.5)), line('M12 12.5v1.3'), body(C(12, 16.5, 2.5))], ${Z})`,
    `icon('litter-box', 'Litter Box', ['cat litter', 'tray', 'pet care', 'cat', 'hygiene'], [body('M3.5 11h17l-1.5 8a1.5 1.5 0 0 1-1.5 1.2h-11A1.5 1.5 0 0 1 5 19Z'), line('M5 14.5h14')], ${Z})`,
  ],
  people: [
    `icon('baby-monitor', 'Baby Monitor', ['nursery camera', 'baby cam', 'parent unit', 'infant', 'monitor'], [line('M15 8V4'), body(R(6, 8, 12, 12.5, 2.5)), line(R(8.5, 10.5, 7, 5, 1)), line(D(12, 18))], ${Z})`,
  ],
};
export default combos([
  ['bag', 'shield', 'Buyer Protection', 'safe purchase, guarantee, protected order, shopping', 'commerce'],
  ['bag', 'pin', 'Pickup Point', 'collect order, click and collect, store pickup, shopping', 'commerce'],
  ['cart', 'lock', 'Secure Cart', 'secure checkout, locked basket, safe payment, shopping', 'commerce'],
  ['cart', 'pin', 'Pickup Location', 'collection point, delivery address, store, shopping', 'commerce'],
  ['gift', 'lock', 'Locked Gift', 'surprise, reveal later, sealed present, gift', 'celebration'],
  ['gift', 'bolt', 'Instant Gift', 'e-gift, digital gift card, quick present, gift', 'celebration'],
  ['invoice', 'shield', 'Verified Invoice', 'secure billing, authentic invoice, protected, accounts', 'finance'],
  ['laptop', 'pin', 'Remote Work', 'work from anywhere, location, workplace, laptop', 'devices'],
  ['map', 'shield', 'Safe Route', 'secure route, safety map, protected journey, navigation', 'maps'],
  ['message', 'lock', 'Private Message', 'locked chat, confidential, secure message, dm', 'communication'],
  ['package', 'search', 'Track Package', 'parcel tracking, order status, lookup, delivery', 'logistics'],
  ['package', 'clock', 'Delivery Time', 'eta, scheduled delivery, parcel, time slot', 'logistics'],
  ['package', 'pin', 'Delivery Location', 'drop off point, address, parcel, destination', 'logistics'],
  ['store', 'lock', 'Store Closed', 'closed shop, after hours, locked store, retail', 'commerce'],
  ['tag', 'lock', 'Price Lock', 'locked price, price guarantee, fixed rate, deal', 'commerce'],
  ['ticket', 'lock', 'Reserved Ticket', 'held seat, booking locked, reservation, event', 'commerce'],
], out);
