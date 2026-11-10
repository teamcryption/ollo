// Which derived variants each drawn icon gets, kept in one place so the whole library can be
// audited at a glance (`node src/audit.mjs`). Merged into the def by name; badges are added
// to any the def already lists.
//
//   badges      status disc: add / remove / check / close / alert
//   off         `<name>-off` with the slash in front (things that can be switched off)
//   containers  the glyph inside a circle and/or rounded square
//
// Rule of thumb: an object people collect or manage gets badges, a thing that can be
// switched off gets `off`, a bare glyph used as a button gets a container.
const OBJ = ['add', 'check', 'close'];
const FULL = ['add', 'remove', 'check', 'close', 'alert'];

export default {
  // interface
  'layout-sidebar': { mirror: { name: 'layout-sidebar-right', title: 'Sidebar Right', tags: ['layout', 'panel', 'right', 'inspector'] } },
  filter: { off: true },
  copy: { badges: ['check'] },
  edit: { off: true },
  flag: { badges: ['add', 'check', 'close'] },
  link: { off: true },
  star: { badges: ['add', 'remove', 'check'] },
  // actions
  plus: { containers: ['square'] },
  minus: { containers: ['square'] },
  check: { containers: ['square'] },
  close: { containers: ['square'] },
  lightbulb: { off: true },
  print: { badges: ['check', 'close'] },
  save: { badges: ['check'] },
  pushpin: { off: true },
  // communication
  broadcast: { off: true },
  'contact-card': { badges: OBJ },
  megaphone: { off: true },
  messages: { badges: ['add', 'check'] },
  message: { off: true },
  'video-call': { off: true },
  // commerce
  bag: { badges: ['close', 'remove'] },
  package: { badges: OBJ },
  receipt: { badges: ['add', 'check', 'close'] },
  store: { badges: OBJ },
  tag: { badges: OBJ },
  truck: { badges: ['check', 'close'] },
  gift: { badges: ['add', 'check'] },
  // data
  table: { badges: OBJ },
  // development
  terminal: { badges: ['check', 'close', 'alert'] },
  bug: { off: true, badges: ['check'] },
  flask: { badges: ['check', 'close'] },
  puzzle: { badges: OBJ },
  'package-code': { badges: ['add', 'check'] },
  // devices
  laptop: { badges: ['check', 'close'], off: true },
  tablet: { badges: ['check', 'close'], off: true },
  'server-rack': { badges: ['check', 'close', 'alert'] },
  'hard-drive': { badges: ['check', 'alert'] },
  bluetooth: { off: true },
  router: { off: true },
  // files
  archive: { badges: ['add', 'check'] },
  files: { badges: ['close'] },
  // finance
  'piggy-bank': { badges: ['add', 'remove'] },
  // media
  camera: { off: true },
  headphones: { off: true },
  music: { off: true },
  pause: { containers: ['circle'] },
  playlist: { badges: ['add', 'check'] },
  // navigation
  pin: { off: true, badges: ['close', 'alert'] },
  layers: { badges: ['add', 'check'] },
  navigation: { off: true },
  // people
  'user-group': { badges: ['add', 'check'] },
  'id-badge': { badges: ['check'] },
  // security
  key: { badges: ['add', 'check'] },
  fingerprint: { badges: ['check', 'close'] },
  // emoji
  'face-smile': { badges: ['add'] },
  // time
  alarm: { off: true, badges: ['add', 'check'] },
  timer: { off: true },
  history: { mirror: { name: 'time-forward', title: 'Time Forward', tags: ['future', 'forward', 'later', 'fast forward time'] } },
  // devices (batch 8)
  webcam: { off: true },
  monitor: { badges: ['check', 'close'] },
  tv: { off: true },
  'usb-drive': { badges: ['check', 'close'] },
  // people / security (batch 17)
  // interface (batch 15)
  'layout-top': { mirror: { name: 'layout-bottom', title: 'Footer Layout', tags: ['layout', 'footer', 'bottom bar', 'page'], axis: 'y' } },
  // travel / transport (batch 11)
  airplane: { off: true },
  luggage: { badges: ['check', 'close'] },
  // actions / design / text / business (batch 10)
  type: { off: true },
  briefcase: { badges: ['add', 'check'] },
  'qr-code': { badges: ['check'] },
  // finance / data / navigation (batch 9)
  'credit-card': { off: true, badges: ['add', 'check', 'close'] },
  banknote: { off: true },
  'money-bag': { badges: ['add'] },
  // development (batch 8)
  'git-branch': { badges: ['add'] },
  // household and devices that can be switched off (batch 96)
  'desk-lamp': { off: true },
  flashlight: { off: true },
  doorbell: { off: true },
  speaker: { off: true },
  sprinkler: { off: true },
  'ring-light': { off: true },
  // review and office (batch 97)
  resume: { badges: ['check'] },
  // batch 98
  'git-merge': { badges: ['alert'] },
  'split-bill': { badges: ['check'] },
  // batch 99
  'load-balancer': { badges: ['check', 'alert'] },
  // batch 100
  flashcards: { badges: ['add', 'check'] },
  'cold-chain': { badges: ['alert'] },
  antivirus: { badges: ['check', 'alert'] },
  'drone-delivery': { badges: ['check'] },
  // batch 101
  'network-switch': { badges: ['check', 'alert'] },
  // batch 103: status variants on existing objects
  coupon: { badges: ['add', 'check'] },
  'sticky-note': { badges: ['add', 'check'] },
  report: { badges: ['check', 'alert'] },
  ticket: { badges: ['add', 'close'] },
  keyboard: { off: true },
  mouse: { off: true },
  radio: { off: true },
  globe: { off: true },
  plug: { off: true },
  cpu: { badges: ['alert'] },
  coins: { badges: ['add'] },
  wallet: { badges: ['close'] },
  kanban: { badges: ['check'] },
  contract: { badges: ['add'] },
  invoice: { badges: ['add'] },
  podcast: { off: true },
};

export { OBJ, FULL };
