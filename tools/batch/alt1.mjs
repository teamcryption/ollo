// Alternate designs of core icons (each a new drawing; full uniqueness check applies).
export default {
  interface: [
    "icon('menu-2', 'Menu Alt', ['hamburger', 'navigation', 'lines', 'drawer'], [line(L(4, 6, 20, 6)), line(L(4, 12, 15, 12)), line(L(4, 18, 20, 18)), accent(L(18, 12, 20, 12))])",
    "icon('menu-3', 'Menu Short', ['hamburger', 'navigation', 'lines', 'compact'], [line(L(4, 8, 20, 8)), line(L(4, 16, 13, 16)), accent(L(16, 16, 20, 16))])",
    "icon('menu-4', 'Menu Left', ['hamburger', 'navigation', 'lines', 'left aligned'], [line(L(4, 6, 20, 6)), line(L(4, 12, 16, 12)), accent(L(4, 18, 10, 18))])",
    "icon('menu-5', 'Menu Rounded', ['hamburger', 'navigation', 'drawer', 'rounded'], [body(R(3, 4, 18, 16, 4)), line(L(7.5, 9, 16.5, 9)), line(L(7.5, 12, 16.5, 12)), accent(L(7.5, 15, 12, 15))])",
    "icon('home-2', 'Home Alt', ['house', 'main', 'start', 'dashboard'], [line('M3.5 11 12 4l8.5 7'), body(R(6, 10, 12, 10.5, 1.5)), accent(L(10.5, 16, 13.5, 16))])",
    "icon('home-3', 'Home Chimney', ['house', 'main', 'start', 'chimney'], [body('M4 11 12 4.5 20 11v8.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5Z'), line('M16.5 7.2V4'), accent(L(10, 16.5, 14, 16.5))])",
    "icon('home-4', 'Home Arch', ['house', 'main', 'start', 'door'], [body('M4 20V11.5a2 2 0 0 1 .8-1.6l6-4.5a2 2 0 0 1 2.4 0l6 4.5a2 2 0 0 1 .8 1.6V20Z'), line('M10 20v-4a2 2 0 0 1 4 0v4'), accent(L(8, 12.5, 9.5, 12.5))])",
    "icon('settings-2', 'Settings Sliders', ['preferences', 'controls', 'adjust', 'options'], [line('M4 7h9M17 7h3M4 17h3M11 17h9'), line(C(15, 7, 2)), line(C(9, 17, 2)), accent(L(4, 12, 9, 12))])",
    "icon('settings-3', 'Settings Cog', ['preferences', 'gear', 'options', 'configure'], [body(gear(12, 12, 8.5, 6.5, 6, 0.45)), line(C(12, 12, 2.5)), accent(L(18.5, 3.5, 20, 5))])",
    "icon('search-2', 'Search Alt', ['find', 'lookup', 'magnifier', 'explore'], [line(C(10.5, 10.5, 6.5)), line(L(15.5, 15.5, 20, 20)), accent('M7.5 9.5a3.2 3.2 0 0 1 2.5-2.4')])",
    "icon('search-3', 'Search Bold Handle', ['find', 'lookup', 'magnifier', 'zoom'], [line(C(10, 10, 6)), body('M14.6 15.7l1.1-1.1 4.5 4.5a.8.8 0 0 1 0 1.1l-.6.6a.8.8 0 0 1-1.1 0Z'), accent(L(7.5, 10, 12.5, 10))])",
    "icon('star-2', 'Star Rounded', ['favorite', 'rating', 'bookmark', 'featured'], [body(star(12, 12.5, 9, 4.2, 5, 1.6)), accent(L(18.5, 4, 20, 5.5))])",
    "icon('heart-2', 'Heart Rounded', ['like', 'love', 'favorite', 'health'], [body('M12 19.5c-.4 0-8-4.3-8-9.6A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 2.9c0 5.3-7.6 9.6-8 9.6Z'), accent('M7.2 9.7a1.9 1.9 0 0 1 1.2-1.5')])",
  ],
  people: [
    "icon('user-2', 'User Alt', ['person', 'profile', 'account', 'avatar'], [body(C(12, 8, 4)), line('M4.5 20.5c.8-4 3.8-6.5 7.5-6.5s6.7 2.5 7.5 6.5'), accent(L(19, 4, 20.5, 5.5))])",
    "icon('user-3', 'User Rounded', ['person', 'profile', 'account', 'member'], [body(R(8, 3.5, 8, 9, 4)), body('M4 20.5a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6Z'), accent(L(17.5, 6, 19.5, 6))])",
    "icon('user-4', 'User Card', ['person', 'profile', 'identity', 'badge'], [body(R(3, 4.5, 18, 15, 3)), line(C(12, 10, 2.3)), line('M8 17c.6-1.8 2.1-2.8 4-2.8s3.4 1 4 2.8'), accent(L(16.5, 7, 18.5, 7))])",
  ],
  communication: [
    "icon('mail-2', 'Mail Alt', ['email', 'envelope', 'message', 'inbox'], [body(R(3, 5.5, 18, 13, 2.5)), line('M3.5 7.5 12 13l8.5-5.5'), accent(L(6, 16, 9, 16))])",
    "icon('mail-3', 'Mail Open Flap', ['email', 'envelope', 'letter', 'post'], [body('M3 10l9-6 9 6v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19Z'), line('M3.5 10.5l8.5 5.5 8.5-5.5'), accent(L(10.5, 8, 13.5, 8))])",
    "icon('chat-2', 'Chat Rounded', ['message', 'conversation', 'comment', 'talk'], [body('M12 4c4.7 0 8.5 3.1 8.5 7s-3.8 7-8.5 7c-1 0-2-.1-2.9-.4L5 19.5l1.2-3.5C4.6 14.7 3.5 13 3.5 11c0-3.9 3.8-7 8.5-7Z'), accent(L(9, 11, 15, 11))])",
    "icon('chat-3', 'Chat Square', ['message', 'conversation', 'comment', 'support'], [body('M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4 4v-4h-.5A1.5 1.5 0 0 1 4 14.5Z'), line(L(8, 8.5, 16, 8.5)), accent(L(8, 11.5, 12, 11.5))])",
    "icon('chat-4', 'Chat Double', ['messages', 'conversation', 'chat', 'thread'], [body('M3.5 5.5A1.5 1.5 0 0 1 5 4h9a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 14 13H8.5l-3 3v-3H5a1.5 1.5 0 0 1-1.5-1.5Z'), line('M18 8.5h1a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-.5v3l-3-3H11'), accent(L(7, 8.5, 11, 8.5))])",
    "icon('phone-2', 'Phone Alt', ['call', 'telephone', 'contact', 'dial'], [body('M5 4h3l1.5 4-2 1.5a10 10 0 0 0 7 7L16 14.5l4 1.5v3a1.5 1.5 0 0 1-1.5 1.5C10.5 20.5 3.5 13.5 3.5 5.5A1.5 1.5 0 0 1 5 4Z'), accent('M15 4.5a5 5 0 0 1 4.5 4.5')])",
    "icon('phone-3', 'Smartphone Alt', ['mobile', 'device', 'cell', 'handset'], [body(R(6, 2.8, 12, 18.4, 3)), line(L(10.5, 5.5, 13.5, 5.5)), accent(L(10.5, 18, 13.5, 18))])",
  ],
  security: [
    "icon('lock-2', 'Lock Alt', ['secure', 'private', 'password', 'locked'], [line('M8 10V7.5a4 4 0 0 1 8 0V10'), body(R(5, 10, 14, 10.5, 2.5)), accent(L(12, 14, 12, 16.5))])",
    "icon('lock-3', 'Lock Round', ['secure', 'private', 'padlock', 'protected'], [line('M8.5 9.5V7a3.5 3.5 0 0 1 7 0v2.5'), body(C(12, 15, 6)), accent(L(12, 13.5, 12, 16.5))])",
  ],
  time: [
    "icon('calendar-2', 'Calendar Alt', ['date', 'schedule', 'event', 'month'], [body(R(3.5, 5, 17, 15.5, 3)), line('M8 3.5v3M16 3.5v3M3.7 10h16.6'), accent(L(7.5, 14.5, 10.5, 14.5))])",
    "icon('calendar-3', 'Calendar Day', ['date', 'today', 'day', 'schedule'], [body(R(4, 4.5, 16, 16, 3)), line('M4.2 9h15.6'), line(L(12, 12.5, 12, 17)), accent(L(8, 6.8, 9.5, 6.8))])",
  ],
  files: [
    "icon('folder-2', 'Folder Alt', ['directory', 'files', 'organize', 'storage'], [body('M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z'), accent(L(6.5, 16, 10.5, 16))])",
    "icon('folder-3', 'Folder Tab', ['directory', 'files', 'tab', 'archive'], [body('M3 9h18v9.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z'), line('M3.5 9V6a2 2 0 0 1 2-2h3.5l2 3h8.5a1.5 1.5 0 0 1 1.5 1.5'), accent(L(7, 15, 10, 15))])",
  ],
  commerce: [
    "icon('cart-2', 'Cart Alt', ['shopping', 'basket', 'checkout', 'buy'], [line('M3 4h2.5l2.2 10.5h10l2-7.5H6.4'), line(C(9, 18.5, 1.5)), line(C(16.5, 18.5, 1.5)), accent(L(10.5, 10.5, 15.5, 10.5))])",
    "icon('cart-3', 'Cart Basket', ['shopping', 'basket', 'checkout', 'store'], [body('M3.5 9.5h17l-1.8 9a1.5 1.5 0 0 1-1.5 1.2H6.8a1.5 1.5 0 0 1-1.5-1.2Z'), line('M8 9.5 10.5 4M16 9.5 13.5 4'), accent(L(9.5, 14.5, 14.5, 14.5))])",
  ],
  media: [
    "icon('camera-2', 'Camera Alt', ['photo', 'picture', 'capture', 'snapshot'], [body('M3 8.5A2 2 0 0 1 5 6.5h2l1.5-2h7l1.5 2h2a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z'), line(C(12, 13, 3.5)), accent(L(17, 9.5, 18.5, 9.5))])",
    "icon('camera-3', 'Camera Compact', ['photo', 'picture', 'compact', 'lens'], [body(R(3, 6.5, 18, 13, 3)), line(C(14, 13, 3.5)), line(L(6, 10, 8, 10)), accent(L(6, 4.5, 9, 4.5))])",
  ],
  actions: [
    "icon('trash-2', 'Trash Alt', ['delete', 'remove', 'bin', 'garbage'], [line('M4 6.5h16M9.5 6.5V4.5h5v2'), body('M6 6.5h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.4h-7A1.5 1.5 0 0 1 7 19Z'), accent(L(12, 10.5, 12, 16))])",
    "icon('bookmark-2', 'Bookmark Alt', ['save', 'favorite', 'saved', 'later'], [body('M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5v16l-6-4-6 4Z'), accent(L(9.5, 7.5, 14.5, 7.5))])",
    "icon('share-2', 'Share Alt', ['send', 'export', 'forward', 'social'], [line('M12 3.5v11M8 7.5l4-4 4 4'), line('M8 11H6.5A1.5 1.5 0 0 0 5 12.5v6A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-6a1.5 1.5 0 0 0-1.5-1.5H16'), accent(L(9.5, 17, 14.5, 17))])",
  ],
  weather: [
    "icon('cloud-2', 'Cloud Alt', ['weather', 'sky', 'storage', 'online'], [body('M7 18.5a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 17.6 8a5.3 5.3 0 0 1-.6 10.5Z'), accent('M9.5 12a2.6 2.6 0 0 1 2.5-2')])",
  ],
};
