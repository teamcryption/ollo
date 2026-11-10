const HEARTP = 'M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z';
const M = {
  search: `body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')`,
  clock: `body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')`,
  shield: `body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })`,
  gear: `body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))`,
  pin: `body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))`,
  star: `body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })`,
  bolt: `body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })`,
  lock: `body(R(13.8, 15, 7, 6, 1.5), { cover: true }), line('M15.3 15v-1.5a2 2 0 0 1 4 0V15')`,
  heart: `body(translateD(scaleD('${HEARTP}', 0.42), 5.3, 4.8), { cover: true })`,
};
const B = {
  bank: `body(poly([[9.5, 3.5], [16, 7], [3, 7]], 0.8, true)), line('M5.5 9.5v5M9.5 9.5v5M13.5 9.5v5M3 17.5h12')`,
  hospital: `body(R(3.5, 4, 12, 15.5, 1.5)), line('M9.5 7.5v4M7.5 9.5h4')`,
  camera: `body('M3 8.5A2.5 2.5 0 0 1 5.5 6h1.3l1.2-2h4l1.2 2h.3A2.5 2.5 0 0 1 16 8.5v6a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 3 14.5Z'), line(C(9.5, 11.2, 2.6))`,
  car: `body(poly([[3, 14.5], [3, 11.2], [5.2, 6.5], [13.3, 6.5], [16, 11.2], [16, 14.5]], 1, true)), line('M3.2 11h12.6'), body(C(6.5, 15.5, 1.8), { cover: true })`,
  ticket: `body('M3 7.5A1.5 1.5 0 0 1 4.5 6h10A1.5 1.5 0 0 1 16 7.5V9a1.5 1.5 0 0 0 0 3v1.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 13.5V12a1.5 1.5 0 0 0 0-3Z'), line('M11 6.5v1.5M11 10v1M11 13v1.5')`,
  message: `body('M5.5 4h9A2.5 2.5 0 0 1 17 6.5v4a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 3v-3A2.5 2.5 0 0 1 3 10.5v-4A2.5 2.5 0 0 1 5.5 4Z')`,
  building: `body(R(4, 3.5, 11, 16, 1.5)), line('M7 7h1.5M10.5 7H12M7 10.5h1.5M10.5 10.5H12M7 14h1.5')`,
  store: `line('M3 9 4.5 4.5h10L16 9'), body(R(4, 9, 11, 10, 1.2)), line('M7.5 19v-4h3v4')`,
};
const LIST = [
  ['bank', 'search', 'Find a Bank', 'bank search, branch finder, banking, lookup'],
  ['bank', 'gear', 'Bank Settings', 'account settings, banking preferences, bank options, configure'],
  ['bank', 'lock', 'Secure Banking', 'bank security, locked account, safe deposit, protected'],
  ['bank', 'star', 'Preferred Bank', 'favourite bank, top rated bank, featured, banking'],
  ['hospital', 'shield', 'Health Insurance', 'medical cover, hospital insurance, protected care, healthcare'],
  ['hospital', 'heart', 'Cardiology', 'heart care, cardiac unit, hospital, wellbeing'],
  ['hospital', 'star', 'Top Hospital', 'rated hospital, best clinic, featured, healthcare'],
  ['hospital', 'gear', 'Hospital Admin', 'facility settings, hospital management, healthcare ops, configure'],
  ['camera', 'pin', 'Photo Location', 'geotag, where taken, photo map, camera'],
  ['camera', 'lock', 'Private Photos', 'locked camera, secure photos, privacy, camera'],
  ['camera', 'heart', 'Favourite Shots', 'liked photos, best shots, photography, love'],
  ['camera', 'star', 'Featured Photo', 'top shot, editors pick, photography, highlight'],
  ['camera', 'shield', 'Camera Privacy', 'camera protection, privacy shield, secure camera, webcam'],
  ['camera', 'search', 'Image Search', 'reverse image search, visual search, find photo, camera'],
  ['car', 'search', 'Find a Car', 'car search, vehicle lookup, dealership, browse cars'],
  ['car', 'gear', 'Car Service', 'vehicle maintenance, garage, repair, car settings'],
  ['car', 'lock', 'Car Lock', 'lock car, central locking, vehicle security, anti theft'],
  ['car', 'heart', 'Saved Cars', 'favourite cars, wishlist, liked vehicles, garage'],
  ['car', 'star', 'Top Rated Car', 'featured car, best seller, review, vehicle'],
  ['ticket', 'pin', 'Event Venue', 'venue location, where event, ticket map, directions'],
  ['ticket', 'heart', 'Saved Tickets', 'favourite events, wishlist, liked shows, tickets'],
  ['ticket', 'bolt', 'Fast Track', 'priority entry, express ticket, skip the line, quick'],
  ['message', 'shield', 'Encrypted Message', 'secure chat, private message, end to end, protected'],
  ['message', 'gear', 'Chat Settings', 'message preferences, notifications, configure, conversation'],
  ['message', 'heart', 'Liked Message', 'react, love message, favourite, chat'],
  ['building', 'lock', 'Restricted Building', 'secured office, access control, locked premises, security'],
  ['building', 'star', 'Featured Property', 'top office, premium space, real estate, highlight'],
  ['store', 'shield', 'Verified Store', 'trusted seller, secure shop, buyer protection, retail'],
  ['store', 'gear', 'Store Settings', 'shop settings, manage store, retail admin, configure'],
  ['store', 'heart', 'Favourite Shop', 'liked store, followed shop, retail, saved'],
  ['store', 'bolt', 'Express Store', 'quick shop, fast delivery, instant, retail'],
];
const cat = { bank: 'finance', hospital: 'health', camera: 'media', car: 'transport', ticket: 'commerce', message: 'communication', building: 'buildings', store: 'commerce' };
const out = {};
for (const [b, m, title, tags] of LIST) {
  const t = tags.split(', ').concat([b]).map((x) => `'${x}'`).join(', ');
  (out[cat[b]] ??= []).push(`icon('${b}-${m}', '${title}', [${t}], [${B[b]}, ${M[m]}], { noAccent: true })`);
}
export default out;
