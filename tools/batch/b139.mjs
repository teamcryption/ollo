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
  cart: `line('M3 4.5h1.8l1.8 8.5h6.2l1.2-5.5H5.6'), line(D(7, 16.5) + D(11.5, 16.5))`,
  mail: `body(R(3, 5, 14.5, 11, 2)), line('M5.5 8l4.75 3 4.75-3')`,
  school: `line('M9.5 6V2.8l2.5 1-2.5 1'), body(poly([[3, 11], [9.5, 6.5], [16, 11], [16, 19], [3, 19]], 1, true)), line('M8 19v-3.5h3V19')`,
  invoice: `body(R(4, 3.5, 11.5, 15.5, 2)), line('M7 7.5h5.5M7 10.5h5.5M7 13.5h3')`,
  wallet: `body(R(3, 5, 14, 11, 2.5)), line('M16.8 8.5h-3.3a1.75 1.75 0 0 0 0 3.5h3.3')`,
  pill: `body(rotateD(R(7, 2.5, 5, 13, 2.5), 45, 9.5, 9)), line(rotateD('M7.2 9h4.6', 45, 9.5, 9))`,
  globe: `body(C(9.5, 9.5, 6.5)), line(E(9.5, 9.5, 2.7, 6.3)), line('M3.2 9.5h12.6')`,
  note: `body(R(3.5, 3.5, 12, 15, 2)), line('M6.5 7.5h6M6.5 10.5h6M6.5 13.5h3')`,
  code: `body(R(3, 4, 12, 15, 2)), line('M7.2 9 5.5 11l1.7 2M10.8 9l1.7 2-1.7 2')`,
  bell: `body('M5.2 17.5h13.6l-1.3-2.1v-4.6a5.5 5.5 0 0 0-11 0v4.6Z'), line(L(10.5, 20.2, 13.5, 20.2)), line(L(12, 3.5, 12, 4.2))`,
};
const LIST = [
  ['cart', 'heart', 'Wishlist Cart', 'saved for later, wishlist, liked items, shopping', 'commerce'],
  ['cart', 'clock', 'Saved Cart', 'abandoned cart, reserved items, shopping history, basket', 'commerce'],
  ['cart', 'star', 'Top Picks', 'recommended, best sellers, featured, shopping', 'commerce'],
  ['mail', 'pin', 'Mailing Address', 'postal address, send to, location, mail', 'communication'],
  ['mail', 'heart', 'Love Letter', 'valentine, fan mail, favourite email, mail', 'communication'],
  ['mail', 'bolt', 'Express Mail', 'priority email, urgent, quick send, mail', 'communication'],
  ['school', 'heart', 'Favourite School', 'saved school, alma mater, education, love', 'education'],
  ['school', 'gear', 'School Admin', 'school settings, administration, management, education', 'education'],
  ['invoice', 'star', 'Priority Invoice', 'important invoice, flagged bill, featured, accounts', 'finance'],
  ['wallet', 'gear', 'Wallet Settings', 'payment settings, cards, preferences, configure', 'finance'],
  ['pill', 'search', 'Drug Lookup', 'medication search, pharmacy, medicine info, pill', 'health'],
  ['globe', 'bolt', 'Fast Network', 'global speed, cdn, fast internet, worldwide', 'maps'],
  ['note', 'search', 'Find Note', 'search notes, lookup, memo, notebook', 'files'],
  ['note', 'clock', 'Reminder Note', 'note reminder, scheduled note, memo, due', 'files'],
  ['note', 'pin', 'Pinned Note', 'pin note, important, sticky, memo', 'files'],
  ['note', 'heart', 'Favourite Note', 'liked note, saved memo, love, notebook', 'files'],
  ['code', 'star', 'Starred Repo', 'favourite repository, star project, github style, code', 'development'],
  ['code', 'lock', 'Private Code', 'private repository, locked source, secure code, access', 'development'],
  ['code', 'shield', 'Code Security', 'secure code, vulnerability scan, safe source, audit', 'development'],
  ['code', 'gear', 'Build Settings', 'project settings, config, developer options, code', 'development'],
  ['bell', 'gear', 'Notification Settings', 'alert settings, notification preferences, configure, bell', 'notifications'],
  ['bell', 'heart', 'Liked Alerts', 'favourite notifications, reactions, alerts, bell', 'notifications'],
];
const out = {
  weather: [
    `icon('cloud-wind', 'Windy Cloud', ['wind', 'breezy', 'gusts', 'weather', 'blustery'], [body('M7 15a3.8 3.8 0 0 1-.5-7.6 5.5 5.5 0 0 1 10.6 1A3.3 3.3 0 0 1 17 15Z'), line('M4.5 18h11a1.5 1.5 0 1 1-1.5 1.5'), accent(L(6.5, 21, 10.5, 21))])`,
    `icon('temperature-high', 'High Temperature', ['heat', 'hot', 'rising temperature', 'warm', 'weather'], [body('M10 5.5a2 2 0 0 1 4 0v8.1a4 4 0 1 1-4 0Z'), accent(L(12, 9, 12, 16.5)), line('M18 10V4.5M16 6.5l2-2 2 2')])`,
    `icon('temperature-low', 'Low Temperature', ['cold', 'freezing', 'falling temperature', 'chilly', 'weather'], [body('M10 5.5a2 2 0 0 1 4 0v8.1a4 4 0 1 1-4 0Z'), accent(L(12, 9, 12, 16.5)), line('M18 4.5V10M16 8l2 2 2-2')])`,
  ],
};
for (const [b, m, title, tags, cat] of LIST) {
  const t = tags.split(', ').concat([b]).map((x) => `'${x}'`).join(', ');
  (out[cat] ??= []).push(`icon('${b}-${m}', '${title}', [${t}], [${B[b]}, ${M[m]}], { noAccent: true })`);
}
export default out;
