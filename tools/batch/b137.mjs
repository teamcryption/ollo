const HEARTP = 'M12 19C11.6 19 4 14.8 4 9.6C4 7.3 5.8 5.5 8.1 5.5C9.7 5.5 11.1 6.4 12 7.7C12.9 6.4 14.3 5.5 15.9 5.5C18.2 5.5 20 7.3 20 9.6C20 14.8 12.4 19 12 19Z';
const M = {
  search: `body(C(16.5, 15.5, 3.5), { cover: true }), line('M19 18l2 2')`,
  clock: `body(C(17, 16.5, 4), { cover: true }), line('M17 14.6v1.9l1.3 1')`,
  shield: `body('M17 10.8l3.8 1.5v3.2c0 2.6-1.6 4.6-3.8 5.3-2.2-.7-3.8-2.7-3.8-5.3v-3.2Z', { cover: true })`,
  gear: `body(gear(17, 16.5, 4.3, 3.2, 8, 0.35), { cover: true }), line(C(17, 16.5, 1.2))`,
  pin: `body('M17.5 21s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 15, 1.1))`,
  star: `body(star(17, 16.5, 4.6, 2.1, 5, 0.6), { cover: true })`,
  bolt: `body(poly([[18.5, 10.5], [14, 16.5], [17, 16.5], [16, 21], [20.5, 14.8], [17.5, 14.8]], 0.5, true), { cover: true })`,
  lock: `line('M15.5 15v-1.5a2 2 0 0 1 4 0V15'), body(R(14, 15, 7, 5.5, 1.2), { cover: true })`,
  heart: `body(translateD(scaleD('${HEARTP}', 0.42), 5.3, 4.8), { cover: true })`,
};
const B = {
  gift: `body(R(3, 8, 13, 10, 1.5)), line('M9.5 8.2v9.6M3.2 11.5h12.6'), line('M9.5 8C8.5 5.5 6 4.5 5.5 6.3S8 8 9.5 8c1.5 0 4.5-.5 4-1.7S10.5 5.5 9.5 8')`,
  school: `line('M9.5 6V2.8l2.5 1-2.5 1'), body(poly([[3, 11], [9.5, 6.5], [16, 11], [16, 19], [3, 19]], 1, true)), line('M8 19v-3.5h3V19')`,
  wallet: `body(R(3, 5, 14, 11, 2.5)), line('M16.8 8.5h-3.3a1.75 1.75 0 0 0 0 3.5h3.3')`,
  bag: `line('M7 7.5V6.5a2.5 2.5 0 0 1 5 0v1'), body('M4.5 8.8A1.3 1.3 0 0 1 5.8 7.5h7.4a1.3 1.3 0 0 1 1.3 1.3l.6 8.5a1.8 1.8 0 0 1-1.8 1.9H5.7a1.8 1.8 0 0 1-1.8-1.9Z')`,
  invoice: `body(R(4, 3.5, 11.5, 15.5, 2)), line('M7 7.5h5.5M7 10.5h5.5M7 13.5h3')`,
  map: `body(poly([[3.5, 6], [9, 4], [15, 6], [20.5, 4], [20.5, 18], [15, 20], [9, 18], [3.5, 20]], 1, true)), line(L(9, 4.4, 9, 17.6))`,
  tag: `body('M3 4.5A1.5 1.5 0 0 1 4.5 3h4.8a1.5 1.5 0 0 1 1.1.4l5 5a1.5 1.5 0 0 1 0 2.2l-4.6 4.6a1.5 1.5 0 0 1-2.2 0l-5-5A1.5 1.5 0 0 1 3 9.1Z'), line(D(6.5, 6.5))`,
  package: `body(R(3.5, 5, 12, 12, 2)), line('M9.5 5.2v3.5')`,
};
const LIST = [
  ['gift', 'clock', 'Scheduled Gift', 'send later, gift delivery date, surprise, present', 'celebration'],
  ['gift', 'star', 'Top Gift', 'best gift, popular present, featured, gift idea', 'celebration'],
  ['gift', 'pin', 'Gift Delivery', 'gift address, send to, delivery location, present', 'celebration'],
  ['school', 'search', 'Find a School', 'school search, admissions, education, lookup', 'education'],
  ['school', 'star', 'Top School', 'rated school, best school, ranking, education', 'education'],
  ['school', 'shield', 'Safe School', 'school safety, safeguarding, protected campus, education', 'education'],
  ['wallet', 'lock', 'Locked Wallet', 'secure wallet, frozen card, protected funds, payments', 'finance'],
  ['wallet', 'clock', 'Pending Payment', 'payment history, scheduled payment, wallet, transactions', 'finance'],
  ['wallet', 'heart', 'Donations Wallet', 'charity, giving, saved money, wallet', 'finance'],
  ['wallet', 'star', 'Rewards Wallet', 'cashback, points, loyalty, wallet', 'finance'],
  ['wallet', 'bolt', 'Instant Pay', 'quick payment, tap to pay, fast transfer, wallet', 'finance'],
  ['bag', 'search', 'Shop Search', 'find products, browse shop, shopping search, store', 'commerce'],
  ['bag', 'clock', 'Order History', 'past orders, purchase history, shopping, recent', 'commerce'],
  ['bag', 'star', 'Best Sellers', 'top products, featured, popular items, shopping', 'commerce'],
  ['bag', 'lock', 'Secure Checkout', 'safe shopping, protected payment, checkout, store', 'commerce'],
  ['bag', 'bolt', 'Flash Sale', 'quick buy, deal, limited offer, shopping', 'commerce'],
  ['invoice', 'search', 'Find Invoice', 'invoice lookup, billing search, accounts, receipts', 'finance'],
  ['invoice', 'lock', 'Locked Invoice', 'finalised invoice, secure billing, protected, accounts', 'finance'],
  ['invoice', 'bolt', 'Instant Invoice', 'quick billing, auto invoice, fast, accounts', 'finance'],
  ['invoice', 'gear', 'Billing Settings', 'invoice settings, billing preferences, accounts, configure', 'finance'],
  ['map', 'clock', 'Travel Time', 'journey time, eta, route duration, map', 'maps'],
  ['map', 'star', 'Saved Places', 'favourite places, starred locations, map, bookmarks', 'maps'],
  ['map', 'heart', 'Loved Places', 'favourite spots, wishlist places, map, travel', 'maps'],
  ['tag', 'clock', 'Limited Offer', 'time limited deal, sale ends, countdown, price', 'commerce'],
  ['tag', 'star', 'Special Price', 'featured deal, best price, offer, label', 'commerce'],
  ['tag', 'heart', 'Saved Deal', 'favourite offer, wishlist price, deal, label', 'commerce'],
  ['tag', 'bolt', 'Flash Deal', 'lightning deal, quick sale, discount, price', 'commerce'],
  ['package', 'heart', 'Care Package', 'gift box, parcel with love, delivery, package', 'logistics'],
  ['package', 'star', 'Priority Parcel', 'premium shipping, featured package, delivery, parcel', 'logistics'],
  ['package', 'lock', 'Secure Parcel', 'sealed package, locked box, protected delivery, parcel', 'logistics'],
  ['package', 'bolt', 'Express Delivery', 'fast shipping, same day, quick parcel, courier', 'logistics'],
];
const out = {};
for (const [b, m, title, tags, cat] of LIST) {
  const t = tags.split(', ').concat([b]).map((x) => `'${x}'`).join(', ');
  (out[cat] ??= []).push(`icon('${b}-${m}', '${title}', [${t}], [${B[b]}, ${M[m]}], { noAccent: true })`);
}
export default out;
